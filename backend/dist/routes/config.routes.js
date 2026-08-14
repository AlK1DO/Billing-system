"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const validate_1 = require("../middlewares/validate");
const config_validator_1 = require("../validators/config.validator");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /api/config/company:
 *   get:
 *     summary: Obtener información de la empresa
 *     tags: [Config]
 *   put:
 *     summary: Actualizar información de la empresa (solo admin)
 *     tags: [Config]
 * /api/config/users:
 *   get:
 *     summary: Listar usuarios de la empresa (solo admin)
 *     tags: [Config]
 *   post:
 *     summary: Crear nuevo usuario en la empresa (solo admin)
 *     tags: [Config]
 */
// GET /api/config/company
router.get('/company', async (req, res, next) => {
    try {
        const doc = await firebase_1.db.collection('companies').doc(req.user.companyId).get();
        if (!doc.exists)
            return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/config/company
router.put('/company', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(config_validator_1.updateCompanySchema), async (req, res, next) => {
    try {
        const allowed = ['name', 'ruc', 'address', 'logoUrl', 'phone', 'email'];
        const updates = {};
        allowed.forEach((key) => {
            if (req.body[key] !== undefined)
                updates[key] = req.body[key];
        });
        updates.updatedAt = new Date();
        await firebase_1.db.collection('companies').doc(req.user.companyId).update(updates);
        res.json({ success: true, message: 'Empresa actualizada' });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/config/users  (solo admin)
router.get('/users', (0, authorize_1.authorize)('admin'), async (req, res, next) => {
    try {
        const snapshot = await firebase_1.db
            .collection('users')
            .where('companyId', '==', req.user.companyId)
            .get();
        const users = snapshot.docs.map((d) => {
            const { passwordHash: _, ...u } = { id: d.id, ...d.data() };
            return u;
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/config/users  — crear nuevo usuario en la empresa (solo admin)
router.post('/users', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(config_validator_1.createUserSchema), async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // Verificar email único
        const existing = await firebase_1.db.collection('users').where('email', '==', email).limit(1).get();
        if (!existing.empty) {
            res.status(409).json({ success: false, message: 'El correo ya está registrado' });
            return;
        }
        const { hashPassword } = await Promise.resolve().then(() => __importStar(require('../utils/bcrypt')));
        const now = new Date();
        const userRef = firebase_1.db.collection('users').doc();
        await userRef.set({
            name,
            email,
            passwordHash: hashPassword(password),
            role,
            companyId: req.user.companyId,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
        res.status(201).json({ success: true, data: { id: userRef.id, name, email, role } });
    }
    catch (error) {
        next(error);
    }
});
// PATCH /api/config/users/:id/deactivate (solo admin)
router.patch('/users/:id/deactivate', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(config_validator_1.userParamsSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        // No puede desactivarse a sí mismo
        if (id === req.user.userId) {
            res.status(400).json({ success: false, message: 'No puedes desactivarte a ti mismo' });
            return;
        }
        const userDoc = await firebase_1.db.collection('users').doc(id).get();
        if (!userDoc.exists) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return;
        }
        if (userDoc.data()?.companyId !== req.user.companyId) {
            res.status(403).json({ success: false, message: 'No autorizado' });
            return;
        }
        await firebase_1.db.collection('users').doc(id).update({ isActive: false, updatedAt: new Date() });
        res.json({ success: true, message: 'Usuario desactivado' });
    }
    catch (error) {
        next(error);
    }
});
// PATCH /api/config/users/:id/activate (solo admin)
router.patch('/users/:id/activate', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(config_validator_1.userParamsSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDoc = await firebase_1.db.collection('users').doc(id).get();
        if (!userDoc.exists) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return;
        }
        if (userDoc.data()?.companyId !== req.user.companyId) {
            res.status(403).json({ success: false, message: 'No autorizado' });
            return;
        }
        await firebase_1.db.collection('users').doc(id).update({ isActive: true, updatedAt: new Date() });
        res.json({ success: true, message: 'Usuario reactivado' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=config.routes.js.map