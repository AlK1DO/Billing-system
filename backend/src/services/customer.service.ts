import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { paginate } from '../utils/pagination';

interface CustomerQuery {
  search?: string;
  page: number;
  limit: number;
}

interface CreateCustomerData {
  name: string;
  documentType: 'DNI' | 'RUC' | 'CE' | 'PASSPORT';
  documentNumber: string;
  phone?: string;
  email?: string;
  address?: string;
  companyId: number;
}

type UpdateCustomerData = Partial<Omit<CreateCustomerData, 'companyId'>>;

export async function getCustomers(companyId: number, query: CustomerQuery) {
  const where: Prisma.CustomerWhereInput = {
    companyId,
    ...(query.search && {
      OR: [
        { name: { contains: query.search } },
        { documentNumber: { contains: query.search } },
        { email: { contains: query.search } },
      ],
    }),
  };

  const [total, customers] = await prisma.$transaction([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return paginate(customers, query.page, query.limit, total);
}

export async function getCustomerById(id: number, companyId: number) {
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (!customer) throw new AppError('Cliente no encontrado', 404);
  if (customer.companyId !== companyId) throw new AppError('No autorizado', 403);

  return customer;
}

export async function createCustomer(data: CreateCustomerData) {
  return prisma.customer.create({
    data: {
      name: data.name,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      phone: data.phone ?? null,
      email: data.email || null,
      address: data.address ?? null,
      totalPurchased: 0,
      companyId: data.companyId,
    },
  });
  // Prisma lanza P2002 si documentNumber + companyId viola el @@unique
}

export async function updateCustomer(
  id: number,
  companyId: number,
  data: UpdateCustomerData
) {
  await getCustomerById(id, companyId);

  return prisma.customer.update({
    where: { id },
    data: {
      ...data,
      email: data.email === '' ? null : data.email,
    },
  });
}

export async function deleteCustomer(id: number, companyId: number) {
  await getCustomerById(id, companyId);
  await prisma.customer.delete({ where: { id } });
}
