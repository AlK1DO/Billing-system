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
exports.getSales = getSales;
exports.getSale = getSale;
exports.createSale = createSale;
exports.cancelSale = cancelSale;
const saleService = __importStar(require("../services/sale.service"));
async function getSales(req, res, next) {
    try {
        const result = await saleService.getSales(req.user.companyId, req.query);
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function getSale(req, res, next) {
    try {
        const sale = await saleService.getSaleById(req.params.id, req.user.companyId);
        res.json({ success: true, data: sale });
    }
    catch (error) {
        next(error);
    }
}
async function createSale(req, res, next) {
    try {
        const sale = await saleService.createSale(req.body, req.user);
        res.status(201).json({ success: true, data: sale });
    }
    catch (error) {
        next(error);
    }
}
async function cancelSale(req, res, next) {
    try {
        const sale = await saleService.cancelSale(req.params.id, req.user.companyId, req.user.userId, req.user.email);
        res.json({ success: true, data: sale });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=sale.controller.js.map