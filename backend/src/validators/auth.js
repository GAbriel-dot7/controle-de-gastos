import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório.'),
  email: z.string().trim().email('Email inválido.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.').max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email inválido.'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres.').max(72),
});
