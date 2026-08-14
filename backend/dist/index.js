"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
// ── Validación de variables de entorno requeridas ────────────────────────────
const REQUIRED_ENV_VARS = [
    'JWT_SECRET',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
    console.error('   Copia .env.example a .env y configura los valores requeridos.');
    process.exit(1);
}
const PORT = process.env.PORT ?? 4000;
app_1.default.listen(PORT, () => {
    console.log(`🚀 TechLedger API corriendo en http://localhost:${PORT}`);
    console.log(`📚 Documentación: http://localhost:${PORT}/api/docs`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV ?? 'development'}`);
});
//# sourceMappingURL=index.js.map