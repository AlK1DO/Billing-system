import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { JwtPayload } from '../middlewares/authenticate';
import { paginate } from '../utils/pagination';

interface MovementQuery {
  productId?: number;
  type?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}

interface CreateMovementData {
  productId: number;
  type: 'entry' | 'return' | 'adjustment';
  quantity: number;
  reason?: string;
}

export async function getMovements(companyId: number, query: MovementQuery) {
  const where: Prisma.InventoryMovementWhereInput = {
    companyId,
    ...(query.productId && { productId: query.productId }),
    ...(query.type && { type: query.type }),
    ...((query.from || query.to) && {
      createdAt: {
        ...(query.from && { gte: new Date(query.from) }),
        ...(query.to && { lte: new Date(query.to) }),
      },
    }),
  };

  const [total, movements] = await prisma.$transaction([
    prisma.inventoryMovement.count({ where }),
    prisma.inventoryMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return paginate(movements, query.page, query.limit, total);
}

export async function getLowStockProducts(companyId: number) {
  const products = await prisma.product.findMany({
    where: { companyId, status: 'active' },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      minStock: true,
      status: true,
      category: { select: { id: true, name: true } },
    },
  });

  return {
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.minStock),
    outOfStock: products.filter((p) => p.stock === 0),
  };
}

export async function createMovement(data: CreateMovementData, user: JwtPayload) {
  return prisma.$transaction(
    async (tx) => {
      // Read the product inside the serializable transaction so concurrent
      // stock adjustments cannot calculate from the same stale stock value.
      const product = await tx.product.findUnique({ where: { id: data.productId } });
      if (!product) throw new AppError('Producto no encontrado', 404);
      if (product.companyId !== user.companyId) throw new AppError('No autorizado', 403);

      const newStock = product.stock + data.quantity;
      if (newStock < 0) {
        throw new AppError(
          `Stock insuficiente. Stock actual: ${product.stock}, ajuste solicitado: ${data.quantity}`,
          400
        );
      }

      const userRecord = await tx.user.findUnique({
        where: { id: user.userId },
        select: { name: true },
      });
      const userName = userRecord?.name ?? user.email;

      await tx.product.update({
        where: { id: product.id },
        data: { stock: newStock },
      });

      return tx.inventoryMovement.create({
        data: {
          type: data.type,
          quantity: data.quantity,
          previousStock: product.stock,
          currentStock: newStock,
          reason: data.reason ?? null,
          productName: product.name,
          productSku: product.sku,
          userName,
          productId: product.id,
          userId: user.userId,
          companyId: user.companyId,
          saleId: null,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}
