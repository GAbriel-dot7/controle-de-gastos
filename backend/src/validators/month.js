import { z } from 'zod';

export const monthCloseSchema = z.object({
  month: z.coerce.number().int().min(1, 'Mês deve estar entre 1 e 12.').max(12, 'Mês deve estar entre 1 e 12.'),
  year: z.coerce.number().int().min(2000, 'Ano inválido.'),
});
