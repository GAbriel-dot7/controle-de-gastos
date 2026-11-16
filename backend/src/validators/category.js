import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Nome da categoria é obrigatório.').max(60),
});
