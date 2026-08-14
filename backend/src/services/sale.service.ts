import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { generateReceiptNumber } from '../utils/bcrypt';
import { paginate } from '../utils/pagination';
import { JwtPayload } from '../middlewares/authenticate';
import { Prisma } from '@prisma/client';

const IGV_RATE = 0.18;
// Máximo de reintentos si se produce una colisión en receiptNumber
const MAX_RECEIPT_RETRIES = 3;

interface CreateSaleDto {
  customerId: number;
  items: { productId: number; quantity: number }[];
  notes?: string;
}

interface SaleQuery {
  customerId?: number;
  sellerId?: number;
  status?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}

export async function getSales(companyId: number, query: SaleQuery) {
  const where: Prisma.SaleWhereInput = {
    companyId,
    ...(query.customerId && { customerId: query.customerId }),
    ...(query.sellerId && { sellerId: query.sellerId }),
    ...(query.status && { status: query.status }),
    ...((query.from || query.to) && {
      createdAt: {
        ...(query.from && { gte: new Date(query.from) }),
        ...(query.to && { lte: new Date(query.to) }),
      },
    }),
  };

  const [total, sales] = await prisma.$transaction([
    prisma.sale.count({ where }),
    prisma.sale.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return paginate(sales, query.page, query.limit, total);
}

export async function getSaleById(id: number, companyId: number) {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!sale) throw new AppError('Venta no encontrada', 404);
  if (sale.companyId !== companyId) throw new AppError('No autorizado', 403);

  return sale;
}

export async function createSale(input: CreateSaleDto, seller: JwtPayload) {
  // Obtener el nombre real del vendedor desde la base de datos
  const sellerUser = await prisma.user.findUnique({
    where: { id: seller.userId },
    select: { id: true, name: true },
  });
  if (!sellerUser) throw new AppError('Usuario vendedor no encontrado', 404);

  // Intentar crear la venta con reintentos ante colisión de receiptNumber
  for (let attempt = 0; attempt < MAX_RECEIPT_RETRIES; attempt++) {
    const receiptNumber = generateReceiptNumber('F');

    try {
      return await _createSaleInTransaction(input, seller, sellerUser.name, receiptNumber);
    } catch (err: unknown) {
      // P2002 en el campo receiptNumber → reintentar con un nuevo número
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (Array.isArray(err.meta?.target)
          ? (err.meta?.target as string[]).includes('receiptNumber')
          : String(err.meta?.target ?? '').includes('receiptNumber'))
      ) {
        if (attempt === MAX_RECEIPT_RETRIES - 1) {
          throw new AppError('No se pudo generar un número de comprobante único. Intenta de nuevo.', 500);
        }
        continue;
      }
      throw err; // Cualquier otro error se propaga normalmente
    }
  }

  // TypeScript requiere un return explícito aunque el loop siempre retorna o lanza
  throw new AppError('Error inesperado al crear la venta', 500);
}

async function _createSaleInTransaction(
  input: CreateSaleDto,
  seller: JwtPayload,
  sellerName: string,
  receiptNumber: string
) {
  return prisma.$transaction(async (tx) => {
    // 1. Verificar cliente
    const customer = await tx.customer.findUnique({
      where: { id: input.customerId },
    });
    if (!customer) throw new AppError('Cliente no encontrado', 404);
    if (customer.companyId !== seller.companyId)
      throw new AppError('No autorizado', 403);

    // 2. Procesar ítems
    let subtotal = 0;
    const saleItemsData: Prisma.SaleItemCreateManySaleInput[] = [];
    const movementsData: Array<{
      type: 'sale';
      quantity: number;
      previousStock: number;
      currentStock: number;
      productName: string;
      productSku: string;
      userName: string;
      productId: number;
      userId: number;
      companyId: number;
    }> = [];

    for (const item of input.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });

      if (!product) throw new AppError(`Producto ${item.productId} no encontrado`, 404);
      if (product.companyId !== seller.companyId) throw new AppError('No autorizado', 403);
      if (product.status === 'inactive')
        throw new AppError(`El producto "${product.name}" no está disponible`, 400);
      if (product.stock < item.quantity)
        throw new AppError(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`,
          400
        );

      const unitPrice = Number(product.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;
      const newStock = product.stock - item.quantity;

      saleItemsData.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
      });

      // Actualizar stock dentro de la transacción
      await tx.product.update({
        where: { id: product.id },
        data: { stock: newStock },
      });

      movementsData.push({
        type: 'sale',
        quantity: -item.quantity,
        previousStock: product.stock,
        currentStock: newStock,
        productName: product.name,
        productSku: product.sku,
        userName: sellerName,
        productId: product.id,
        userId: seller.userId,
        companyId: seller.companyId,
      });
    }

    const igv = subtotal * IGV_RATE;
    const total = subtotal + igv;

    // 3. Crear la venta con sus ítems (nested write)
    const sale = await tx.sale.create({
      data: {
        receiptNumber,
        status: 'completed',
        subtotal,
        igv,
        total,
        notes: input.notes ?? null,
        customerName: customer.name,
        customerDocument: customer.documentNumber,
        sellerName,
        customerId: customer.id,
        sellerId: seller.userId,
        companyId: seller.companyId,
        items: { createMany: { data: saleItemsData } },
      },
      include: { items: true },
    });

    // 4. Registrar movimientos de inventario
    await tx.inventoryMovement.createMany({
      data: movementsData.map((m) => ({ ...m, saleId: sale.id })),
    });

    // 5. Actualizar estadísticas del cliente
    await tx.customer.update({
      where: { id: customer.id },
      data: {
        totalPurchased: { increment: total },
        lastPurchaseAt: new Date(),
      },
    });

    return sale;
  });
}

export async function cancelSale(
  id: number,
  companyId: number,
  userId: number,
  userEmail: string
) {
  // Obtener el nombre real del usuario que cancela
  const cancelUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const cancelUserName = cancelUser?.name ?? userEmail;

  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!sale) throw new AppError('Venta no encontrada', 404);
    if (sale.companyId !== companyId) throw new AppError('No autorizado', 403);
    if (sale.status === 'cancelled') throw new AppError('La venta ya está cancelada', 400);

    // Revertir stock de cada producto
    for (const item of sale.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const newStock = product.stock + item.quantity;

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      await tx.inventoryMovement.create({
        data: {
          type: 'return',
          quantity: item.quantity,
          previousStock: product.stock,
          currentStock: newStock,
          reason: `Cancelación de venta ${sale.receiptNumber}`,
          productName: item.productName,
          productSku: item.productSku,
          userName: cancelUserName,
          productId: item.productId,
          userId,
          companyId,
          saleId: sale.id,
        },
      });
    }

    // Revertir totalPurchased del cliente
    const saleTotal = Number(sale.total);
    await tx.customer.update({
      where: { id: sale.customerId },
      data: {
        totalPurchased: {
          decrement: saleTotal,
        },
      },
    });

    // Marcar venta como cancelada
    return tx.sale.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { items: true },
    });
  });
}
