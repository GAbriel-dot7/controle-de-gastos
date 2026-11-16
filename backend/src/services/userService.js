import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';

export async function listUsers() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return users.map(({ passwordHash, ...user }) => user);
}

export async function deleteUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado.');
  }

  await prisma.user.delete({ where: { id: userId } });
}
