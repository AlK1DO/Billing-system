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
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const productService = __importStar(require("../services/product.service"));
async function getProducts(req, res, next) {
    try {
        const result = await productService.getProducts(req.user.companyId, req.query);
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function getProduct(req, res, next) {
    try {
        const product = await productService.getProductById(req.params.id, req.user.companyId);
        res.json({ success: true, data: product });
    }
    catch (error) {
        next(error);
    }
}
async function createProduct(req, res, next) {
    try {
        const product = await productService.createProduct({
            ...req.body,
            companyId: req.user.companyId,
        });
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        next(error);
    }
}
async function updateProduct(req, res, next) {
    try {
        const product = await productService.updateProduct(req.params.id, req.user.companyId, req.body);
        res.json({ success: true, data: product });
    }
    catch (error) {
        next(error);
    }
}
async function deleteProduct(req, res, next) {
    try {
        await productService.deleteProduct(req.params.id, req.user.companyId);
        res.json({ success: true, message: 'Producto eliminado correctamente' });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=product.controller.js.map