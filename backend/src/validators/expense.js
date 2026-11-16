import { z } from 'zod';

export const expenseSchema = z.object({
  description: z.string().trim().min(2, 'Descrição é obrigatória.'),
  amount: z.coerce.number({ invalid_type_error: 'Valor deve ser numérico.' }).positive('O valor deve ser maior que zero.'),
  dueDate: z.string().min(1, 'Data da despesa é obrigatória.'),
  categoryId: z.string().min(1, 'Categoria é obrigatória.'),
  paymentStatus: z.enum(['PENDING', 'PAID']).optional().default('PENDING'),
});

export const expenseUpdateSchema = z.object({
  description: z.string().trim().min(2, 'Descrição é obrigatória.').optional(),
  amount: z.coerce.number({ invalid_type_error: 'Valor deve ser numérico.' }).positive('O valor deve ser maior que zero.').optional(),
  dueDate: z.string().min(1, 'Data da despesa é obrigatória.').optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória.').optional(),
  paymentStatus: z.enum(['PENDING', 'PAID']).optional(),
});

export const expenseQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).optional(),
  categoryId: z.string().optional(),
  paymentStatus: z.enum(['PENDING', 'PAID']).optional(),
});
