import asyncHandler from '../utils/asyncHandler.js';
import { categorySchema } from '../validators/category.js';
import AppError from '../utils/AppError.js';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService.js';

export const list = asyncHandler(async (req, res) => {
  const categories = await listCategories(req.user.id);
  res.status(200).json({ categories });
});

export const create = asyncHandler(async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const category = await createCategory(req.user.id, parsed.data.name);
  res.status(201).json({ category });
});

export const update = asyncHandler(async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const category = await updateCategory(req.user.id, req.params.id, parsed.data.name);
  res.status(200).json({ category });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteCategory(req.user.id, req.params.id);
  res.status(204).send();
});
