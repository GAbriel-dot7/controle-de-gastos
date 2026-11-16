import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@exemplo.com';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.warn('SEED_ADMIN_PASSWORD não definido. O seed não foi executado.');
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin já existe: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name: 'Administrador',
      email,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Admin criado com e-mail: ${email}`);
}


main()
  .catch((error) => {
    console.error('Erro no seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
