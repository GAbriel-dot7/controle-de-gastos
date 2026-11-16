import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { monthCloseSchema } from '../validators/month.js';
import { closeMonth, listClosedMonths, reopenMonth } from '../services/monthService.js';

export const list = asyncHandler(async (req, res) => {
  const months = await listClosedMonths(req.user.id);
  res.status(200).json({ months });
});

export const close = asyncHandler(async (req, res) => {
  const parsed = monthCloseSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const month = await closeMonth(req.user.id, parsed.data.month, parsed.data.year);
  res.status(201).json({ month });
});

export const reopen = asyncHandler(async (req, res) => {
  const month = Number(req.params.month);
  const year = Number(req.params.year);

  if (Number.isNaN(month) || Number.isNaN(year)) {
    throw new AppError(400, 'Mês e ano inválidos.');
  }

  await reopenMonth(req.user.id, month, year);
  res.status(204).send();
});
