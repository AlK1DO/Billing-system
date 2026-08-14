import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryById(id: number) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError('Categoría no encontrada', 404);
  return category;
}

export async function createCategory(name: string) {
  // Prisma lanza P2002 si el nombre viola el @unique
  return prisma.category.create({ data: { name } });
}

export async function updateCategory(id: number, name: string) {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: { name } });
}

export async function deleteCategory(id: number) {
  await getCategoryById(id);

  // Verificar que no hay productos asociados
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new AppError(
      `No se puede eliminar: la categoría tiene ${productCount} producto(s) asociado(s)`,
      409
    );
  }

  await prisma.category.delete({ where: { id } });
}
