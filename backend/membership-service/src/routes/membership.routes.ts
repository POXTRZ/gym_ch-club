import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken } from '../../../shared/middleware/auth.middleware';
import { apiLimiter } from '../../../shared/middleware/rateLimit.middleware';
import {
  getPlans,
  createMembership,
  getMembershipById,
  getUserMemberships,
  renewMembership,
  cancelMembership,
  getMembershipStatus,
} from '../controllers/membership.controller';

const router = Router();

// GET /api/memberships/plans - Planes disponibles (público)
router.get('/plans', getPlans);

// Las siguientes rutas requieren autenticación y rate limiting
router.use(apiLimiter);
router.use(authenticateToken);

// POST /api/memberships - Crear membresía
router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('El usuario es requerido'),
    body('planType').isIn(['basic', 'premium', 'vip']).withMessage('Tipo de plan inválido'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duración inválida'),
  ],
  validate,
  createMembership
);

// GET /api/memberships/:id - Detalles de membresía
router.get('/:id', getMembershipById);

// GET /api/memberships/user/:userId - Membresías del usuario
router.get('/user/:userId', getUserMemberships);

// PUT /api/memberships/:id/renew - Renovar membresía
router.put(
  '/:id/renew',
  [
    body('months').optional().isInt({ min: 1, max: 12 }).withMessage('Meses inválidos'),
  ],
  validate,
  renewMembership
);

// PUT /api/memberships/:id/cancel - Cancelar membresía
router.put('/:id/cancel', cancelMembership);

// GET /api/memberships/:id/status - Verificar estado activo
router.get('/:id/status', getMembershipStatus);

export default router;
