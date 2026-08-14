"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.getUserById = getUserById;
const firebase_1 = require("../config/firebase");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = require("../utils/bcrypt");
const USERS_COLLECTION = 'users';
const COMPANIES_COLLECTION = 'companies';
async function loginUser(input) {
    const snapshot = await firebase_1.db
        .collection(USERS_COLLECTION)
        .where('email', '==', input.email)
        .limit(1)
        .get();
    if (snapshot.empty) {
        throw new AppError_1.AppError('Credenciales inválidas', 401);
    }
    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };
    if (!user.isActive) {
        throw new AppError_1.AppError('Cuenta desactivada. Contacta al administrador', 403);
    }
    const isValid = (0, bcrypt_1.comparePassword)(input.password, user.passwordHash);
    if (!isValid) {
        throw new AppError_1.AppError('Credenciales inválidas', 401);
    }
    const token = (0, jwt_1.signToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
    });
    const { passwordHash: _, ...userPublic } = user;
    return { token, user: userPublic };
}
async function registerUser(input) {
    // Verificar si el correo ya existe
    const existing = await firebase_1.db
        .collection(USERS_COLLECTION)
        .where('email', '==', input.email)
        .limit(1)
        .get();
    if (!existing.empty) {
        throw new AppError_1.AppError('El correo ya está registrado', 409);
    }
    // Crear empresa
    const companyRef = firebase_1.db.collection(COMPANIES_COLLECTION).doc();
    await companyRef.set({
        name: input.companyName,
        ownerId: '', // se actualizará después
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    // Crear usuario administrador
    const passwordHash = (0, bcrypt_1.hashPassword)(input.password);
    const userRef = firebase_1.db.collection(USERS_COLLECTION).doc();
    const now = new Date();
    await userRef.set({
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'admin',
        companyId: companyRef.id,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    });
    // Actualizar ownerId en empresa
    await companyRef.update({ ownerId: userRef.id });
    const token = (0, jwt_1.signToken)({
        userId: userRef.id,
        email: input.email,
        role: 'admin',
        companyId: companyRef.id,
    });
    const userPublic = {
        id: userRef.id,
        name: input.name,
        email: input.email,
        role: 'admin',
        companyId: companyRef.id,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    };
    return { token, user: userPublic };
}
async function getUserById(userId, companyId) {
    const doc = await firebase_1.db.collection(USERS_COLLECTION).doc(userId).get();
    if (!doc.exists) {
        throw new AppError_1.AppError('Usuario no encontrado', 404);
    }
    const user = { id: doc.id, ...doc.data() };
    if (user.companyId !== companyId) {
        throw new AppError_1.AppError('No autorizado', 403);
    }
    const { passwordHash: _, ...userPublic } = user;
    return userPublic;
}
//# sourceMappingURL=auth.service.js.map