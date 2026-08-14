"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateReceiptNumber = generateReceiptNumber;
/**
 * Wrapper simple sobre el módulo nativo crypto de Node.js para hashear
 * contraseñas sin dependencias externas adicionales.
 * En producción puedes cambiar esto por bcrypt si lo prefieres.
 */
const crypto_1 = require("crypto");
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, crypto_1.createHash)(DIGEST)
        .update(salt + password.repeat(ITERATIONS % 10 + 1))
        .digest('hex');
    return `${salt}:${hash}`;
}
function comparePassword(password, stored) {
    const [salt, storedHash] = stored.split(':');
    const hash = (0, crypto_1.createHash)(DIGEST)
        .update(salt + password.repeat(ITERATIONS % 10 + 1))
        .digest('hex');
    try {
        return (0, crypto_1.timingSafeEqual)(Buffer.from(storedHash, 'hex'), Buffer.from(hash, 'hex'));
    }
    catch {
        return false;
    }
}
function generateReceiptNumber(prefix = 'F') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
//# sourceMappingURL=bcrypt.js.map