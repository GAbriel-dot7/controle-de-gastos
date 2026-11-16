import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';
import { ensureMonthIsOpen } from './monthService.js';

function getMonthYearFromDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'Data da despesa inválida.');
  }

  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export async function listExpenses({ userId, month, year, categoryId, paymentStatus }) {
  const where = {
    userId,
    ...(month ? { month } : {}),
    ...(year ? { year } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
  };

  const expenses = await prisma.expense.findMany({
    where,
    include: { category: true },
    orderBy: [{ dueDate: 'desc' }, { createdAt: 'desc' }],
  });

  return expenses.map((expense) => ({
    ...expense,
    amount: Number(expense.amount),
  }));
}

export async function getExpenseById(userId, expenseId) {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { category: true },
  });

  if (!expense || expense.userId !== userId) {
    throw new AppError(403, 'Você não tem permissão para acessar esta despesa.');
  }

  return { ...expense, amount: Number(expense.amount) };
}

export async function createExpense(userId, payload) {
  const { description, amount, dueDate, categoryId, paymentStatus } = payload;
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, 'Data da despesa inválida.');
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!category) {
    throw new AppError(404, 'Categoria não encontrada para este usuário.');
  }

  const { month, year } = getMonthYearFromDate(date);
  await ensureMonthIsOpen(userId, month, year);

  const expense = await prisma.expense.create({
    data: {
      description,
      amount: amount.toFixed(2),
      dueDate: date,
      month,
      year,
      paymentStatus,
      categoryId,
      userId,
    },
    include: { category: true },
  });

  return { ...expense, amount: Number(expense.amount) };
}

export async function updateExpense(userId, expenseId, payload) {
  const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!existing || existing.userId !== userId) {
    throw new AppError(403, 'Você não tem permissão para alterar esta despesa.');
  }

  const nextDueDate = payload.dueDate || existing.dueDate.toISOString();
  const nextCategoryId = payload.categoryId || existing.categoryId;
  const nextAmount = payload.amount ?? Number(existing.amount);

  const category = await prisma.category.findFirst({
    where: { id: nextCategoryId, userId },
  });

  if (!category) {
    throw new AppError(404, 'Categoria não encontrada para este usuário.');
  }

  const date = new Date(nextDueDate);
  const { month, year } = getMonthYearFromDate(date);

  await ensureMonthIsOpen(userId, month, year);
  if (existing.month !== month || existing.year !== year) {
    await ensureMonthIsOpen(userId, existing.month, existing.year);
  }

  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      description: payload.description ?? existing.description,
      amount: nextAmount.toFixed(2),
      dueDate: date,
      month,
      year,
      categoryId: nextCategoryId,
      paymentStatus: payload.paymentStatus ?? existing.paymentStatus,
    },
    include: { category: true },
  });

  return { ...updated, amount: Number(updated.amount) };
}

export async function deleteExpense(userId, expenseId) {
  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense || expense.userId !== userId) {
    throw new AppError(403, 'Você não tem permissão para excluir esta despesa.');
  }

  await ensureMonthIsOpen(userId, expense.month, expense.year);
  await prisma.expense.delete({ where: { id: expenseId } });
}

export async function updateExpenseStatus(userId, expenseId, paymentStatus) {
  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense || expense.userId !== userId) {
    throw new AppError(403, 'Você não tem permissão para alterar esta despesa.');
  }

  await ensureMonthIsOpen(userId, expense.month, expense.year);
  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: { paymentStatus },
    include: { category: true },
  });

  return { ...updated, amount: Number(updated.amount) };
}

export async function getExpenseSummary(userId, month, year) {
  const expenses = await prisma.expense.findMany({
    where: { userId, month, year },
    include: { category: true },
  });

  const totalsByCategory = new Map();
  let totalPaid = 0;
  let totalPending = 0;

  for (const expense of expenses) {
    const label = expense.category.name;
    const value = Number(expense.amount);
    totalsByCategory.set(label, (totalsByCategory.get(label) || 0) + value);
    if (expense.paymentStatus === 'PAID') totalPaid += value;
    else totalPending += value;
  }

  return {
    totalPaid,
    totalPending,
    total: totalPaid + totalPending,
    byCategory: Array.from(totalsByCategory.entries()).map(([name, total]) => ({ name, total })),
  };
}
