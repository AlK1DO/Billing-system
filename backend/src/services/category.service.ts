import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { JwtPayload } from '../middlewares/authenticate';

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

export async function createCategory(name: string, user: JwtPayload) {
  return prisma.category.create({
    data: { name, companyId: user.companyId },
  });
}

export async function updateCategory(id: number, name: string, user: JwtPayload) {
  await getCategoryById(id, user.companyId);
  return prisma.category.update({ where: { id }, data: { name } });
}

export async function deleteCategory(id: number, user: JwtPayload) {
  await getCategoryById(id, user.companyId);

  const productCount = await prisma.product.count({
    where: { categoryId: id, companyId: user.companyId },
  });
  if (productCount > 0) {
    throw new AppError(
      `No se puede eliminar: la categoría tiene ${productCount} producto(s) asociado(s)`,
      409
    );
  }

  await prisma.category.delete({ where: { id } });
}
