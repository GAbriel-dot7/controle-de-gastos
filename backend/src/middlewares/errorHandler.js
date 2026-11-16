import { env } from '../config/env.js';
import AppError from '../utils/AppError.js';

export function errorHandler(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error?.code === 'P2025') {
    return res.status(404).json({ message: 'Registro não encontrado.' });
  }

  if (error?.code === 'P2002') {
    return res.status(409).json({ message: 'Registro duplicado. Verifique os dados informados.' });
  }

  if (error?.code === 'P2003') {
    return res.status(409).json({ message: 'Os dados informados violam uma regra de relacionamento.' });
  }

  if (error?.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido.' });
  }

  if (error?.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expirado.' });
  }

  if (env.nodeEnv !== 'production') {
    console.error(error);
  }

  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
