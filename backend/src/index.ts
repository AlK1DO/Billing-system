import 'dotenv/config';
import app from './app';

// ── Validación de variables de entorno requeridas ────────────────────────────
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'DATABASE_URL'];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
  console.error('   Copia .env.example a .env y configura los valores requeridos.');
  process.exit(1);
}

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`🚀 TechLedger API corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/api/docs`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV ?? 'development'}`);
});
