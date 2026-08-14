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
exports.getCustomers = getCustomers;
exports.getCustomer = getCustomer;
exports.createCustomer = createCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
const customerService = __importStar(require("../services/customer.service"));
async function getCustomers(req, res, next) {
    try {
        const result = await customerService.getCustomers(req.user.companyId, req.query);
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function getCustomer(req, res, next) {
    try {
        const customer = await customerService.getCustomerById(req.params.id, req.user.companyId);
        res.json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
}
async function createCustomer(req, res, next) {
    try {
        const customer = await customerService.createCustomer({
            ...req.body,
            companyId: req.user.companyId,
        });
        res.status(201).json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
}
async function updateCustomer(req, res, next) {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.user.companyId, req.body);
        res.json({ success: true, data: customer });
    }
    catch (error) {
        next(error);
    }
}
async function deleteCustomer(req, res, next) {
    try {
        await customerService.deleteCustomer(req.params.id, req.user.companyId);
        res.json({ success: true, message: 'Cliente eliminado correctamente' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=customer.controller.js.map