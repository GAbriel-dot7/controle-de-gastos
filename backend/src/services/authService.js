import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import AppError from '../utils/AppError.js';

export async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, 'Este e-mail já está cadastrado.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'Credenciais inválidas.');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Credenciais inválidas.');
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, 'Usuário não encontrado.');
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}
