import { Request, Response, NextFunction } from 'express';
import { AppError, isOperationalError } from '../utils/errors';
import Logger from '../utils/logger';

const logger = new Logger('ERROR_HANDLER');

/**
 * Middleware para manejo centralizado de errores
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error
  logger.error('Error capturado:', err);

  // Si es un AppError, usar su información
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // Errores de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Error de validación',
        details: err.message,
        statusCode: 400,
      },
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'ID inválido',
        statusCode: 400,
      },
    });
    return;
  }

  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    res.status(409).json({
      success: false,
      error: {
        message: 'Registro duplicado',
        statusCode: 409,
      },
    });
    return;
  }

  // Error genérico
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta ${req.originalUrl} no encontrada`,
      statusCode: 404,
    },
  });
};

/**
 * Wrapper para async/await en rutas Express
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
