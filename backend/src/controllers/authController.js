import asyncHandler from '../utils/asyncHandler.js';
import { registerUser, loginUser, getCurrentUser } from '../services/authService.js';
import { registerSchema, loginSchema } from '../validators/auth.js';
import AppError from '../utils/AppError.js';

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const user = await registerUser(parsed.data);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0].message);
  }

  const result = await loginUser(parsed.data);
  res.status(200).json(result);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  res.status(200).json({ user });
});
