import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Genera un número de comprobante único.
 * Formato: F-<timestamp base36>-<6 bytes aleatorios hex>
 * Ejemplo: F-LZYA8K2-A1B2C3D4E5F6
 *
 * La aleatoriedad de 6 bytes (2^48 combinaciones) hace que la probabilidad
 * de colisión en el mismo milisegundo sea prácticamente nula.
 * El constraint UNIQUE en la base de datos actúa como garantía final.
 */
export function generateReceiptNumber(prefix = 'F'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(6).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
