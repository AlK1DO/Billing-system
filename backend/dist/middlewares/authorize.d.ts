import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model';
/**
 * Middleware de autorización por roles.
 * Uso: authorize('admin') o authorize('admin', 'seller')
 */
export declare function authorize(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map