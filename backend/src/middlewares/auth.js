import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import AppError from '../utils/AppError.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError(401, 'Token ausente. Faça login novamente.'));
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Token inválido. Formato incorreto.'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Token expirado. Faça login novamente.'));
    }
    return next(new AppError(401, 'Token inválido. Faça login novamente.'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'Você não tem permissão para acessar este recurso.'));
    }
    return next();
  };
}
