import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';

export async function ensureMonthIsOpen(userId, month, year) {
  const closure = await prisma.monthClosure.findUnique({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });

  if (closure) {
    throw new AppError(409, `O mês ${month}/${year} já foi encerrado. Não é possível alterar despesas deste período.`);
  }
}

export async function listClosedMonths(userId) {
  return prisma.monthClosure.findMany({
    where: { userId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
}

export async function closeMonth(userId, month, year) {
  const existing = await prisma.monthClosure.findUnique({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });

  if (existing) {
    throw new AppError(409, `O mês ${month}/${year} já foi encerrado.`);
  }

  return prisma.monthClosure.create({
    data: {
      userId,
      month,
      year,
    },
  });
}

export async function reopenMonth(userId, month, year) {
  const existing = await prisma.monthClosure.findUnique({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });

  if (!existing) {
    throw new AppError(404, `O mês ${month}/${year} não está encerrado.`);
  }

  return prisma.monthClosure.delete({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
  });
}
