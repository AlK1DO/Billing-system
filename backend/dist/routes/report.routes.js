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
const reportController = __importStar(require("../controllers/report.controller"));
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Reporte de ventas — resumen, por día, por vendedor, top productos
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *         description: Fecha inicio (ISO 8601)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *         description: Fecha fin (ISO 8601)
 *     responses:
 *       200:
 *         description: Datos del reporte de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalSales: { type: integer }
 *                         totalRevenue: { type: number }
 *                         totalIgv: { type: number }
 *                     byDay:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date: { type: string }
 *                           count: { type: integer }
 *                           revenue: { type: number }
 *                     bySeller:
 *                       type: array
 *                     topProducts:
 *                       type: array
 */
router.get('/sales', reportController.salesReport);
/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Reporte de inventario — resumen, stock bajo y por categoría
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Datos del reporte de inventario
 */
router.get('/inventory', reportController.inventoryReport);
/**
 * @swagger
 * /api/reports/customers:
 *   get:
 *     summary: Reporte de clientes — resumen y top 10 por compras
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Datos del reporte de clientes
 */
router.get('/customers', reportController.customerReport);
exports.default = router;
//# sourceMappingURL=report.routes.js.map