"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const firebase_1 = require("../config/firebase");
const AppError_1 = require("../utils/AppError");
const pagination_1 = require("../utils/pagination");
const COLLECTION = 'products';
async function getProducts(companyId, query) {
    let ref = firebase_1.db
        .collection(COLLECTION)
        .where('companyId', '==', companyId);
    if (query.status) {
        ref = ref.where('status', '==', query.status);
    }
    if (query.category) {
        ref = ref.where('category', '==', query.category);
    }
    const snapshot = await ref.orderBy('name').get();
    let products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Filtro por búsqueda en memoria (Firestore no tiene full-text search nativo)
    if (query.search) {
        const term = query.search.toLowerCase();
        products = products.filter((p) => p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term));
    }
    const total = products.length;
    const start = (query.page - 1) * query.limit;
    const paginated = products.slice(start, start + query.limit);
    return (0, pagination_1.paginate)(paginated, query.page, query.limit, total);
}
async function getProductById(id, companyId) {
    const doc = await firebase_1.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists)
        throw new AppError_1.AppError('Producto no encontrado', 404);
    const product = { id: doc.id, ...doc.data() };
    if (product.companyId !== companyId)
        throw new AppError_1.AppError('No autorizado', 403);
    return product;
}
async function createProduct(data) {
    // Verificar SKU único dentro de la empresa
    const existing = await firebase_1.db
        .collection(COLLECTION)
        .where('companyId', '==', data.companyId)
        .where('sku', '==', data.sku)
        .limit(1)
        .get();
    if (!existing.empty) {
        throw new AppError_1.AppError(`El SKU "${data.sku}" ya está en uso`, 409);
    }
    const now = new Date();
    const ref = firebase_1.db.collection(COLLECTION).doc();
    await ref.set({ ...data, createdAt: now, updatedAt: now });
    return { id: ref.id, ...data, createdAt: now, updatedAt: now };
}
async function updateProduct(id, companyId, data) {
    const product = await getProductById(id, companyId);
    // Si cambia el SKU, verificar unicidad
    if (data.sku && data.sku !== product.sku) {
        const existing = await firebase_1.db
            .collection(COLLECTION)
            .where('companyId', '==', companyId)
            .where('sku', '==', data.sku)
            .limit(1)
            .get();
        if (!existing.empty) {
            throw new AppError_1.AppError(`El SKU "${data.sku}" ya está en uso`, 409);
        }
    }
    const updatedAt = new Date();
    await firebase_1.db.collection(COLLECTION).doc(id).update({ ...data, updatedAt });
    return { ...product, ...data, updatedAt };
}
async function deleteProduct(id, companyId) {
    await getProductById(id, companyId); // Verifica que existe y pertenece a la empresa
    await firebase_1.db.collection(COLLECTION).doc(id).delete();
}
//# sourceMappingURL=product.service.js.map