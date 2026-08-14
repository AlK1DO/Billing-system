import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  companyId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Token no proporcionado', 401));
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return next(new AppError('Token no proporcionado', 401));
  }

  try {
    const payload = verifyToken(token);

    if (
      typeof payload.userId !== 'number' ||
      typeof payload.companyId !== 'number' ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return next(new AppError('Token inválido o expirado', 401));
    }

    req.user = payload;
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
}
