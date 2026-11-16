import { prisma } from '../config/prisma.js';
import AppError from '../utils/AppError.js';

export async function listCategories(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export async function createCategory(userId, name) {
  try {
    return await prisma.category.create({
      data: { userId, name },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError(409, 'Essa categoria já existe para este usuário.');
    }
    throw error;
  }
}

export async function updateCategory(userId, categoryId, name) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || category.userId !== userId) {
    throw new AppError(403, 'Você não tem permissão para alterar esta categoria.');
  }

  try {
    return prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError(409, 'Essa categoria já existe para este usuário.');
    }
    throw error;
  }
}

export async function deleteCategory(userId, categoryId) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category || category.userId !== userId) {
    throw new AppError(403, 'Você não tem permissão para excluir esta categoria.');
  }

  const expensesInCategory = await prisma.expense.count({ where: { categoryId } });
  if (expensesInCategory > 0) {
    throw new AppError(409, 'Não é possível excluir uma categoria que possua despesas cadastradas.');
  }

  await prisma.category.delete({ where: { id: categoryId } });
}
