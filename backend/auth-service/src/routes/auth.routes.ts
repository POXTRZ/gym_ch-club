import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken } from '../../../shared/middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  getCurrentUser,
  logout,
  refreshToken,
} from '../controllers/auth.controller';

const router = Router();

// Rate limiter para auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos, intente de nuevo más tarde',
});

// POST /api/auth/register - Registro de usuarios
router.post(
  '/register',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('firstName')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .trim(),
    body('lastName')
      .notEmpty()
      .withMessage('El apellido es requerido')
      .trim(),
    body('phone')
      .notEmpty()
      .withMessage('El teléfono es requerido')
      .trim(),
    body('role')
      .optional()
      .isIn(['admin', 'member', 'trainer'])
      .withMessage('Rol inválido'),
  ],
  validate,
  register
);

// POST /api/auth/login - Login
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida'),
  ],
  validate,
  login
);

// GET /api/auth/me - Usuario actual
router.get('/me', authenticateToken, getCurrentUser);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authenticateToken, logout);

// POST /api/auth/refresh - Refresh token
router.post(
  '/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('El refresh token es requerido'),
  ],
  validate,
  refreshToken
);

export default router;
