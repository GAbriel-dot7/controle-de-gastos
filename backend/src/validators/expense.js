import { z } from 'zod';

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data da despesa inválida.').refine((value) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}, 'Data da despesa inválida.');

export const expenseSchema = z.object({
  description: z.string().trim().min(2, 'Descrição é obrigatória.'),
  amount: z.coerce.number({ invalid_type_error: 'Valor deve ser numérico.' }).positive('O valor deve ser maior que zero.'),
  dueDate: isoDateSchema,
  categoryId: z.string().min(1, 'Categoria é obrigatória.'),
  paymentStatus: z.enum(['PENDING', 'PAID']).optional().default('PENDING'),
});

export const expenseUpdateSchema = z.object({
  description: z.string().trim().min(2, 'Descrição é obrigatória.').optional(),
  amount: z.coerce.number({ invalid_type_error: 'Valor deve ser numérico.' }).positive('O valor deve ser maior que zero.').optional(),
  dueDate: isoDateSchema.optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória.').optional(),
  paymentStatus: z.enum(['PENDING', 'PAID']).optional(),
});

export const expenseQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).optional(),
  categoryId: z.string().optional(),
  paymentStatus: z.enum(['PENDING', 'PAID']).optional(),
});
