import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export async function getCategories(companyId: number) {
  return prisma.category.findMany({
    where: { companyId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryById(id: number, companyId: number) {
  const category = await prisma.category.findFirst({ where: { id, companyId } });
  if (!category) throw new AppError('Categoría no encontrada', 404);
  return category;
}

export async function createCategory(name: string, companyId: number) {
  try {
    return await prisma.category.create({ data: { name: name.trim(), companyId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('Ya existe una categoría con ese nombre en esta empresa', 409);
    }
    throw error;
  }
}

export async function updateCategory(id: number, name: string, companyId: number) {
  await getCategoryById(id, companyId);

  try {
    return await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('Ya existe una categoría con ese nombre en esta empresa', 409);
    }
    throw error;
  }
}

export async function deleteCategory(id: number, companyId: number) {
  await getCategoryById(id, companyId);

  const productCount = await prisma.product.count({ where: { categoryId: id, companyId } });
  if (productCount > 0) {
    throw new AppError(
      `No se puede eliminar: la categoría tiene ${productCount} producto(s) asociado(s)`,
      409
    );
  }

  await prisma.category.delete({ where: { id } });
}
