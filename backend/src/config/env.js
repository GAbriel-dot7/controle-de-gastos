import dotenv from 'dotenv';

dotenv.config();

const requiredInProduction = ['DATABASE_URL', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Variáveis obrigatórias ausentes em produção: ${missing.join(', ')}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@exemplo.com',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || '',
};
