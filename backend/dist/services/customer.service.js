"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = getCustomers;
exports.getCustomerById = getCustomerById;
exports.createCustomer = createCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
const firebase_1 = require("../config/firebase");
const AppError_1 = require("../utils/AppError");
const pagination_1 = require("../utils/pagination");
const COLLECTION = 'customers';
async function getCustomers(companyId, query) {
    const snapshot = await firebase_1.db
        .collection(COLLECTION)
        .where('companyId', '==', companyId)
        .orderBy('name')
        .get();
    let customers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (query.search) {
        const term = query.search.toLowerCase();
        customers = customers.filter((c) => c.name.toLowerCase().includes(term) ||
            c.documentNumber.includes(term) ||
            (c.email ?? '').toLowerCase().includes(term));
    }
    const total = customers.length;
    const start = (query.page - 1) * query.limit;
    return (0, pagination_1.paginate)(customers.slice(start, start + query.limit), query.page, query.limit, total);
}
async function getCustomerById(id, companyId) {
    const doc = await firebase_1.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists)
        throw new AppError_1.AppError('Cliente no encontrado', 404);
    const customer = { id: doc.id, ...doc.data() };
    if (customer.companyId !== companyId)
        throw new AppError_1.AppError('No autorizado', 403);
    return customer;
}
async function createCustomer(data) {
    // Verificar documento único dentro de la empresa
    const existing = await firebase_1.db
        .collection(COLLECTION)
        .where('companyId', '==', data.companyId)
        .where('documentNumber', '==', data.documentNumber)
        .limit(1)
        .get();
    if (!existing.empty) {
        throw new AppError_1.AppError(`Ya existe un cliente con ese número de documento`, 409);
    }
    const now = new Date();
    const ref = firebase_1.db.collection(COLLECTION).doc();
    const customer = {
        ...data,
        totalPurchased: 0,
        createdAt: now,
        updatedAt: now,
    };
    await ref.set(customer);
    return { id: ref.id, ...customer };
}
async function updateCustomer(id, companyId, data) {
    await getCustomerById(id, companyId);
    const updatedAt = new Date();
    await firebase_1.db.collection(COLLECTION).doc(id).update({ ...data, updatedAt });
    return getCustomerById(id, companyId);
}
async function deleteCustomer(id, companyId) {
    await getCustomerById(id, companyId);
    await firebase_1.db.collection(COLLECTION).doc(id).delete();
}
//# sourceMappingURL=customer.service.js.map