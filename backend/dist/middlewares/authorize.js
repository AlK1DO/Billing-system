"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const AppError_1 = require("../utils/AppError");
/**
 * Middleware de autorización por roles.
 * Uso: authorize('admin') o authorize('admin', 'seller')
 */
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError('No autenticado', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError('No tienes permisos para realizar esta acción', 403));
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map