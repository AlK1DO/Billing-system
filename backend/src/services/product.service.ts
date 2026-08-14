import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { paginate } from '../utils/pagination';

interface ProductQuery {
  search?: string;
  categoryId?: number;
  status?: 'active' | 'inactive';
  page: number;
  limit: number;
}

interface CreateProductData {
  name: string;
  sku: string;
  description?: string;
  categoryId?: number | null;
  price: number;
  cost?: number;
  stock: number;
  minStock?: number;
  imageUrl?: string;
  status?: 'active' | 'inactive';
  companyId: number;
}

type UpdateProductData = Partial<Omit<CreateProductData, 'companyId'>>;

export async function getProducts(companyId: number, query: ProductQuery) {
  const where: Prisma.ProductWhereInput = {
    companyId,
    ...(query.status && { status: query.status }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search } },
        { sku: { contains: query.search } },
        { description: { contains: query.search } },
      ],
    }),
  };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return paginate(products, query.page, query.limit, total);
}

export async function getProductById(id: number, companyId: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });

  if (!product) throw new AppError('Producto no encontrado', 404);
  if (product.companyId !== companyId) throw new AppError('No autorizado', 403);
  return product;
}

async function ensureCategoryBelongsToCompany(categoryId: number, companyId: number) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, companyId } });
  if (!category) throw new AppError('Categoría no encontrada', 404);
}

export async function createProduct(data: CreateProductData) {
  if (data.categoryId !== undefined && data.categoryId !== null) {
    await ensureCategoryBelongsToCompany(data.categoryId, data.companyId);
  }

  return prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      description: data.description ?? '',
      categoryId: data.categoryId ?? null,
      price: data.price,
      cost: data.cost ?? 0,
      stock: data.stock,
      minStock: data.minStock ?? 5,
      imageUrl: data.imageUrl ?? null,
      status: data.status ?? 'active',
      companyId: data.companyId,
    },
    include: { category: { select: { id: true, name: true } } },
  });
}

export async function updateProduct(id: number, companyId: number, data: UpdateProductData) {
  await getProductById(id, companyId);

  if (data.categoryId !== undefined && data.categoryId !== null) {
    await ensureCategoryBelongsToCompany(data.categoryId, companyId);
  }

  return prisma.product.update({
    where: { id },
    data,
    include: { category: { select: { id: true, name: true } } },
  });
}

export async function deleteProduct(id: number, companyId: number) {
  await getProductById(id, companyId);
  await prisma.product.delete({ where: { id } });
}
