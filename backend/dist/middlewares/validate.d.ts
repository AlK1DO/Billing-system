import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
/**
 * Middleware genérico de validación con Zod.
 * Valida body, params y query contra el schema proporcionado.
 */
export declare function validate(schema: AnyZodObject): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.d.ts.map