import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { UserRole } from '../models/user.model';

/**
 * Middleware de autorización por roles.
 * Uso: authorize('admin') o authorize('admin', 'seller')
 */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('No autenticado', 401));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(
        new AppError('No tienes permisos para realizar esta acción', 403)
      );
    }

    next();
  };
}
