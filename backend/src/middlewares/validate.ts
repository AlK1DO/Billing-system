import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Middleware genérico de validación con Zod.
 * Valida body, params y query contra el schema proporcionado.
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
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
      (req as any).query = validated.query ?? req.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        next(new AppError(`Validación fallida: ${messages.join(', ')}`, 400));
      } else {
        next(error);
      }
    }
  };
}
