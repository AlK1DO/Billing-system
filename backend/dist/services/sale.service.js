"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSales = getSales;
exports.getSaleById = getSaleById;
exports.createSale = createSale;
exports.cancelSale = cancelSale;
const firebase_1 = require("../config/firebase");
const AppError_1 = require("../utils/AppError");
const bcrypt_1 = require("../utils/bcrypt");
const pagination_1 = require("../utils/pagination");
const SALES_COLLECTION = 'sales';
const PRODUCTS_COLLECTION = 'products';
const CUSTOMERS_COLLECTION = 'customers';
const INVENTORY_COLLECTION = 'inventory_movements';
const IGV_RATE = 0.18;
async function getSales(companyId, query) {
    let ref = firebase_1.db
        .collection(SALES_COLLECTION)
        .where('companyId', '==', companyId);
    if (query.customerId)
        ref = ref.where('customerId', '==', query.customerId);
    if (query.sellerId)
        ref = ref.where('sellerId', '==', query.sellerId);
    if (query.status)
        ref = ref.where('status', '==', query.status);
    const snapshot = await ref.orderBy('createdAt', 'desc').get();
    let sales = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Filtrar por rango de fechas
    if (query.from) {
        const from = new Date(query.from);
        sales = sales.filter((s) => new Date(s.createdAt) >= from);
    }
    if (query.to) {
        const to = new Date(query.to);
        sales = sales.filter((s) => new Date(s.createdAt) <= to);
    }
    const total = sales.length;
    const start = (query.page - 1) * query.limit;
    return (0, pagination_1.paginate)(sales.slice(start, start + query.limit), query.page, query.limit, total);
}
async function getSaleById(id, companyId) {
    const doc = await firebase_1.db.collection(SALES_COLLECTION).doc(id).get();
    if (!doc.exists)
        throw new AppError_1.AppError('Venta no encontrada', 404);
    const sale = { id: doc.id, ...doc.data() };
    if (sale.companyId !== companyId)
        throw new AppError_1.AppError('No autorizado', 403);
    return sale;
}
async function createSale(input, seller) {
    const batch = firebase_1.db.batch();
    // 1. Obtener cliente
    const customerDoc = await firebase_1.db.collection(CUSTOMERS_COLLECTION).doc(input.customerId).get();
    if (!customerDoc.exists)
        throw new AppError_1.AppError('Cliente no encontrado', 404);
    const customer = { id: customerDoc.id, ...customerDoc.data() };
    if (customer.companyId !== seller.companyId)
        throw new AppError_1.AppError('No autorizado', 403);
    // 2. Procesar cada item
    const saleItems = [];
    let subtotal = 0;
    for (const item of input.items) {
        const productDoc = await firebase_1.db.collection(PRODUCTS_COLLECTION).doc(item.productId).get();
        if (!productDoc.exists)
            throw new AppError_1.AppError(`Producto ${item.productId} no encontrado`, 404);
        const product = { id: productDoc.id, ...productDoc.data() };
        if (product.companyId !== seller.companyId)
            throw new AppError_1.AppError('No autorizado', 403);
        if (product.status === 'inactive')
            throw new AppError_1.AppError(`El producto "${product.name}" no está disponible`, 400);
        if (product.stock < item.quantity) {
            throw new AppError_1.AppError(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`, 400);
        }
        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;
        saleItems.push({
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal: itemSubtotal,
        });
        // Actualizar stock del producto
        const newStock = product.stock - item.quantity;
        batch.update(firebase_1.db.collection(PRODUCTS_COLLECTION).doc(product.id), {
            stock: newStock,
            updatedAt: new Date(),
        });
        // Registrar movimiento de inventario
        const movementRef = firebase_1.db.collection(INVENTORY_COLLECTION).doc();
        const movement = {
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            type: 'sale',
            quantity: -item.quantity,
            previousStock: product.stock,
            currentStock: newStock,
            userId: seller.userId,
            userName: seller.email,
            companyId: seller.companyId,
            createdAt: new Date(),
        };
        batch.set(movementRef, movement);
    }
    const igv = subtotal * IGV_RATE;
    const total = subtotal + igv;
    const now = new Date();
    // 3. Crear la venta
    const saleRef = firebase_1.db.collection(SALES_COLLECTION).doc();
    const sale = {
        customerId: customer.id,
        customerName: customer.name,
        customerDocument: customer.documentNumber,
        items: saleItems,
        subtotal,
        igv,
        total,
        status: 'completed',
        sellerId: seller.userId,
        sellerName: seller.email,
        companyId: seller.companyId,
        receiptNumber: (0, bcrypt_1.generateReceiptNumber)('F'),
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
    };
    batch.set(saleRef, sale);
    // 4. Actualizar estadísticas del cliente
    batch.update(firebase_1.db.collection(CUSTOMERS_COLLECTION).doc(customer.id), {
        totalPurchased: (customer.totalPurchased ?? 0) + total,
        lastPurchaseAt: now,
        updatedAt: now,
    });
    await batch.commit();
    return { id: saleRef.id, ...sale };
}
async function cancelSale(id, companyId, userId, userEmail) {
    const batch = firebase_1.db.batch();
    const saleDoc = await firebase_1.db.collection(SALES_COLLECTION).doc(id).get();
    if (!saleDoc.exists)
        throw new AppError_1.AppError('Venta no encontrada', 404);
    const sale = { id: saleDoc.id, ...saleDoc.data() };
    if (sale.companyId !== companyId)
        throw new AppError_1.AppError('No autorizado', 403);
    if (sale.status === 'cancelled')
        throw new AppError_1.AppError('La venta ya está cancelada', 400);
    const now = new Date();
    // Revertir stock de cada producto
    for (const item of sale.items) {
        const productDoc = await firebase_1.db.collection(PRODUCTS_COLLECTION).doc(item.productId).get();
        if (!productDoc.exists)
            continue;
        const product = { id: productDoc.id, ...productDoc.data() };
        const newStock = product.stock + item.quantity;
        batch.update(firebase_1.db.collection(PRODUCTS_COLLECTION).doc(item.productId), {
            stock: newStock,
            updatedAt: now,
        });
        // Registrar movimiento de devolución
        const movementRef = firebase_1.db.collection(INVENTORY_COLLECTION).doc();
        const movement = {
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            type: 'return',
            quantity: item.quantity,
            previousStock: product.stock,
            currentStock: newStock,
            reason: `Cancelación de venta ${sale.receiptNumber}`,
            referenceId: id,
            userId,
            userName: userEmail,
            companyId,
            createdAt: now,
        };
        batch.set(movementRef, movement);
    }
    // Revertir totalPurchased del cliente
    const customerDoc = await firebase_1.db.collection(CUSTOMERS_COLLECTION).doc(sale.customerId).get();
    if (customerDoc.exists) {
        const customer = customerDoc.data();
        batch.update(firebase_1.db.collection(CUSTOMERS_COLLECTION).doc(sale.customerId), {
            totalPurchased: Math.max(0, (customer.totalPurchased ?? 0) - sale.total),
            updatedAt: now,
        });
    }
    // Actualizar estado de la venta
    batch.update(firebase_1.db.collection(SALES_COLLECTION).doc(id), {
        status: 'cancelled',
        updatedAt: now,
    });
    await batch.commit();
    return { ...sale, status: 'cancelled', updatedAt: now };
}
//# sourceMappingURL=sale.service.js.map