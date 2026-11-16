import asyncHandler from '../utils/asyncHandler.js';
import { listUsers, deleteUser } from '../services/userService.js';

export const index = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.status(200).json({ users });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  res.status(204).send();
});
