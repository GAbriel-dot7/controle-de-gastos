import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { expenseSchema, expenseUpdateSchema, expenseQuerySchema } from '../validators/expense.js';
import {
  listExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  updateExpenseStatus,
  getExpenseSummary,
} from '../services/expenseService.js';

export const list = asyncHandler(async (req, res) => {
  const parsed = expenseQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const expenses = await listExpenses({
    userId: req.user.id,
    month: parsed.data.month,
    year: parsed.data.year,
    categoryId: parsed.data.categoryId,
    paymentStatus: parsed.data.paymentStatus,
  });

  res.status(200).json({ expenses });
});

export const getOne = asyncHandler(async (req, res) => {
  const expense = await getExpenseById(req.user.id, req.params.id);
  res.status(200).json({ expense });
});

export const create = asyncHandler(async (req, res) => {
  const parsed = expenseSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const expense = await createExpense(req.user.id, parsed.data);
  res.status(201).json({ expense });
});

export const update = asyncHandler(async (req, res) => {
  const parsed = expenseUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const expense = await updateExpense(req.user.id, req.params.id, parsed.data);
  res.status(200).json({ expense });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteExpense(req.user.id, req.params.id);
  res.status(204).send();
});

export const updateStatus = asyncHandler(async (req, res) => {
  const paymentStatus = req.body.paymentStatus;
  if (!['PENDING', 'PAID'].includes(paymentStatus)) {
    throw new AppError(400, 'Status de pagamento inválido.');
  }

  const expense = await updateExpenseStatus(req.user.id, req.params.id, paymentStatus);
  res.status(200).json({ expense });
});

export const summary = asyncHandler(async (req, res) => {
  const parsed = expenseQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  if (!parsed.data.month || !parsed.data.year) {
    throw new AppError(400, 'Mês e ano são obrigatórios para o resumo.');
  }

  const summary = await getExpenseSummary(req.user.id, parsed.data.month, parsed.data.year);
  res.status(200).json({ summary });
});
