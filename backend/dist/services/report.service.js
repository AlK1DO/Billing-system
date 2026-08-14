"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesReport = getSalesReport;
exports.getInventoryReport = getInventoryReport;
exports.getCustomerReport = getCustomerReport;
const firebase_1 = require("../config/firebase");
async function getSalesReport(companyId, from, to) {
    let ref = firebase_1.db
        .collection('sales')
        .where('companyId', '==', companyId)
        .where('status', '==', 'completed');
    const snapshot = await ref.orderBy('createdAt', 'desc').get();
    let sales = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (from) {
        const fromDate = new Date(from);
        sales = sales.filter((s) => new Date(s.createdAt) >= fromDate);
    }
    if (to) {
        const toDate = new Date(to);
        sales = sales.filter((s) => new Date(s.createdAt) <= toDate);
    }
    // Ventas por día
    const byDay = {};
    sales.forEach((s) => {
        const day = new Date(s.createdAt).toISOString().split('T')[0];
        if (!byDay[day])
            byDay[day] = { total: 0, count: 0 };
        byDay[day].total += s.total;
        byDay[day].count += 1;
    });
    // Ventas por vendedor
    const bySeller = {};
    sales.forEach((s) => {
        if (!bySeller[s.sellerId]) {
            bySeller[s.sellerId] = { name: s.sellerName, total: 0, count: 0 };
        }
        bySeller[s.sellerId].total += s.total;
        bySeller[s.sellerId].count += 1;
    });
    // Productos más vendidos
    const byProduct = {};
    sales.forEach((s) => {
        s.items.forEach((item) => {
            if (!byProduct[item.productId]) {
                byProduct[item.productId] = { name: item.productName, quantity: 0, total: 0 };
            }
            byProduct[item.productId].quantity += item.quantity;
            byProduct[item.productId].total += item.subtotal;
        });
    });
    const topProducts = Object.entries(byProduct)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    return {
        summary: {
            totalSales: sales.length,
            totalRevenue,
            averageTicket: sales.length > 0 ? totalRevenue / sales.length : 0,
        },
        byDay: Object.entries(byDay).map(([date, data]) => ({ date, ...data })),
        bySeller: Object.values(bySeller),
        topProducts,
    };
}
async function getInventoryReport(companyId) {
    const snapshot = await firebase_1.db
        .collection('products')
        .where('companyId', '==', companyId)
        .get();
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalCostValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0);
    return {
        summary: {
            totalProducts: products.length,
            activeProducts: products.filter((p) => p.status === 'active').length,
            totalValue,
            totalCostValue,
        },
        lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.minStock),
        outOfStock: products.filter((p) => p.stock === 0),
        byCategory: groupByCategory(products),
    };
}
async function getCustomerReport(companyId) {
    const snapshot = await firebase_1.db
        .collection('customers')
        .where('companyId', '==', companyId)
        .orderBy('totalPurchased', 'desc')
        .get();
    const customers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
        summary: {
            total: customers.length,
            newThisMonth: customers.filter((c) => new Date(c.createdAt) >= thirtyDaysAgo).length,
        },
        topCustomers: customers.slice(0, 10).map((c) => ({
            id: c.id,
            name: c.name,
            documentNumber: c.documentNumber,
            totalPurchased: c.totalPurchased,
            lastPurchaseAt: c.lastPurchaseAt,
        })),
    };
}
function groupByCategory(products) {
    const map = {};
    products.forEach((p) => {
        if (!map[p.category])
            map[p.category] = { count: 0, totalValue: 0 };
        map[p.category].count += 1;
        map[p.category].totalValue += p.price * p.stock;
    });
    return Object.entries(map).map(([category, data]) => ({ category, ...data }));
}
//# sourceMappingURL=report.service.js.map