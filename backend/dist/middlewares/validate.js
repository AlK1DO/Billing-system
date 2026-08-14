"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
/**
 * Middleware genérico de validación con Zod.
 * Valida body, params y query contra el schema proporcionado.
 */
function validate(schema) {
    return async (req, _res, next) => {
        try {
            const validated = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            // Asigna los valores parseados/transformados de vuelta al request
            req.body = validated.body ?? req.body;
            req.params = validated.params ?? req.params;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req.query = validated.query ?? req.query;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
                next(new AppError_1.AppError(`Validación fallida: ${messages.join(', ')}`, 400));
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=validate.js.map