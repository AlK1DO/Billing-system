import 'dotenv/config';
import app from './app';

const REQUIRED_ENV_VARS = ['JWT_SECRET', 'DATABASE_URL'];
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missing.join(', ')}`);
  console.error('   Copia .env.example a .env y configura los valores requeridos.');
  process.exit(1);
}

const jwtSecret = process.env.JWT_SECRET!;
if (jwtSecret.length < 32) {
  console.error('❌ JWT_SECRET debe tener al menos 32 caracteres.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  if (jwtSecret === 'your_super_secret_jwt_key_here_min_32_chars') {
    console.error('❌ No uses el JWT_SECRET de ejemplo en producción.');
    process.exit(1);
  }

  if (!process.env.FRONTEND_URL || !process.env.FRONTEND_URL.startsWith('https://')) {
    console.error('❌ FRONTEND_URL debe ser una URL HTTPS válida en producción.');
    process.exit(1);
  }
}

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`🚀 TechLedger API corriendo en http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Documentación: http://localhost:${PORT}/api/docs`);
  }
  console.log(`🌍 Entorno: ${process.env.NODE_ENV ?? 'development'}`);
});
