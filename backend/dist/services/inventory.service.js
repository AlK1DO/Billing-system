"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovements = getMovements;
exports.getLowStockProducts = getLowStockProducts;
exports.createMovement = createMovement;
const firebase_1 = require("../config/firebase");
const AppError_1 = require("../utils/AppError");
const pagination_1 = require("../utils/pagination");
const MOVEMENTS_COLLECTION = 'inventory_movements';
const PRODUCTS_COLLECTION = 'products';
async function getMovements(companyId, query) {
    let ref = firebase_1.db
        .collection(MOVEMENTS_COLLECTION)
        .where('companyId', '==', companyId);
    if (query.productId)
        ref = ref.where('productId', '==', query.productId);
    if (query.type)
        ref = ref.where('type', '==', query.type);
    const snapshot = await ref.orderBy('createdAt', 'desc').get();
    let movements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (query.from) {
        const from = new Date(query.from);
        movements = movements.filter((m) => new Date(m.createdAt) >= from);
    }
    if (query.to) {
        const to = new Date(query.to);
        movements = movements.filter((m) => new Date(m.createdAt) <= to);
    }
    const total = movements.length;
    const start = (query.page - 1) * query.limit;
    return (0, pagination_1.paginate)(movements.slice(start, start + query.limit), query.page, query.limit, total);
}
async function getLowStockProducts(companyId) {
    const snapshot = await firebase_1.db
        .collection(PRODUCTS_COLLECTION)
        .where('companyId', '==', companyId)
        .where('status', '==', 'active')
        .get();
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return {
        lowStock: products.filter((p) => p.stock > 0 && p.stock <= p.minStock),
        outOfStock: products.filter((p) => p.stock === 0),
    };
}
async function createMovement(data, user) {
    const productDoc = await firebase_1.db.collection(PRODUCTS_COLLECTION).doc(data.productId).get();
    if (!productDoc.exists)
        throw new AppError_1.AppError('Producto no encontrado', 404);
    const product = { id: productDoc.id, ...productDoc.data() };
    if (product.companyId !== user.companyId)
        throw new AppError_1.AppError('No autorizado', 403);
    const newStock = product.stock + data.quantity;
    if (newStock < 0) {
        throw new AppError_1.AppError(`Stock insuficiente. Stock actual: ${product.stock}, ajuste solicitado: ${data.quantity}`, 400);
    }
    const batch = firebase_1.db.batch();
    // Actualizar stock
    batch.update(firebase_1.db.collection(PRODUCTS_COLLECTION).doc(product.id), {
        stock: newStock,
        updatedAt: new Date(),
    });
    // Registrar movimiento
    const movementRef = firebase_1.db.collection(MOVEMENTS_COLLECTION).doc();
    const movement = {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        type: data.type,
        quantity: data.quantity,
        previousStock: product.stock,
        currentStock: newStock,
        reason: data.reason,
        referenceId: data.referenceId,
        userId: user.userId,
        userName: user.email,
        companyId: user.companyId,
        createdAt: new Date(),
    };
    batch.set(movementRef, movement);
    await batch.commit();
    return { id: movementRef.id, ...movement };
}
//# sourceMappingURL=inventory.service.js.map