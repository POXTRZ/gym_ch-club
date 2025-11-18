import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'member' | 'trainer';
  };
}

/**
 * Middleware para verificar JWT y autenticar usuario
 */
export const authenticateToken = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Token no proporcionado');
    }

    const jwtSecret = process.env.JWT_SECRET || 'super_secret_key_change_in_production';

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      role: 'admin' | 'member' | 'trainer';
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Token inválido'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token expirado'));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Usuario no autenticado');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Rol ${req.user.role} no tiene permiso para acceder a este recurso`
      );
    }

    next();
  };
};

/**
 * Middleware opcional de autenticación
 * No lanza error si no hay token, solo lo adjunta si existe
 */
export const optionalAuth = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET || 'super_secret_key_change_in_production';
      const decoded = jwt.verify(token, jwtSecret) as {
        id: string;
        email: string;
        role: 'admin' | 'member' | 'trainer';
      };
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Ignorar errores de token en auth opcional
    next();
  }
};
