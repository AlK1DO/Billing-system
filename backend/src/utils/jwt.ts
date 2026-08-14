import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../middlewares/authenticate';

const JWT_ALGORITHM = 'HS256' as const;

export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no configurado');

  return jwt.sign(payload, secret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET no configurado');

  return jwt.verify(token, secret, {
    algorithms: [JWT_ALGORITHM],
  }) as JwtPayload;
}
