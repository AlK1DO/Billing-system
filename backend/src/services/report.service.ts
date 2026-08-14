import { prisma } from '../lib/prisma';

export async function getSalesReport(companyId: number, from?: string, to?: string) {
  const dateFilter = (from || to)
    ? {
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }
    : {};

  const sales = await prisma.sale.findMany({
    where: { companyId, status: 'completed', ...dateFilter },
    include: { items: true, seller: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Ventas por día
  const byDayMap: Record<string, { total: number; count: number }> = {};
  sales.forEach((s) => {
    const day = s.createdAt.toISOString().split('T')[0];
    if (!byDayMap[day]) byDayMap[day] = { total: 0, count: 0 };
    byDayMap[day].total += Number(s.total);
    byDayMap[day].count += 1;
  });

  // Ventas por vendedor (usa nombre real del join)
  const bySellerMap: Record<number, { name: string; total: number; count: number }> = {};
  sales.forEach((s) => {
    if (!bySellerMap[s.sellerId]) {
      bySellerMap[s.sellerId] = { name: s.seller.name, total: 0, count: 0 };
    }
    bySellerMap[s.sellerId].total += Number(s.total);
    bySellerMap[s.sellerId].count += 1;
  });

  // Productos más vendidos
  const byProductMap: Record<number, { name: string; quantity: number; total: number }> = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      if (!byProductMap[item.productId]) {
        byProductMap[item.productId] = { name: item.productName, quantity: 0, total: 0 };
      }
      byProductMap[item.productId].quantity += item.quantity;
      byProductMap[item.productId].total += Number(item.subtotal);
    });
  });

  const topProducts = Object.entries(byProductMap)
    .map(([id, data]) => ({ id: Number(id), ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);

  return {
    summary: {
      totalSales: sales.length,
      totalRevenue,
      averageTicket: sales.length > 0 ? totalRevenue / sales.length : 0,
    },
    byDay: Object.entries(byDayMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    bySeller: Object.values(bySellerMap),
    topProducts,
  };
}

export async function getInventoryReport(companyId: number) {
  const products = await prisma.product.findMany({
    where: { companyId },
    include: { category: { select: { id: true, name: true } } },
  });

  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * p.stock,
    0
  );
  const totalCostValue = products.reduce(
    (sum, p) => sum + Number(p.cost ?? 0) * p.stock,
    0
  );

  // Agrupar por categoría
  const byCategoryMap: Record<
    string,
    { categoryId: number | null; count: number; totalValue: number }
  > = {};

  products.forEach((p) => {
    const key = p.category?.name ?? 'Sin categoría';
    if (!byCategoryMap[key]) {
      byCategoryMap[key] = {
        categoryId: p.categoryId,
        count: 0,
        totalValue: 0,
      };
    }
    byCategoryMap[key].count += 1;
    byCategoryMap[key].totalValue += Number(p.price) * p.stock;
  });

  return {
    summary: {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.status === 'active').length,
      totalValue,
      totalCostValue,
    },
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.minStock),
    outOfStock: products.filter((p) => p.stock === 0),
    byCategory: Object.entries(byCategoryMap).map(([category, data]) => ({
      category,
      ...data,
    })),
  };
}

export async function getCustomerReport(companyId: number) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [total, newThisMonth, topCustomers] = await prisma.$transaction([
    prisma.customer.count({ where: { companyId } }),
    prisma.customer.count({
      where: { companyId, createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.customer.findMany({
      where: { companyId },
      orderBy: { totalPurchased: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        documentNumber: true,
        totalPurchased: true,
        lastPurchaseAt: true,
      },
    }),
  ]);

  return {
    summary: { total, newThisMonth },
    topCustomers,
  };
}
