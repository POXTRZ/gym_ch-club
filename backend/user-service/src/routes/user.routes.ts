import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateAvatar,
  searchUsers,
} from '../controllers/user.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/users - Listar usuarios (admin only)
router.get('/', authorizeRoles('admin'), getAllUsers);

// GET /api/users/search - Buscar usuarios
router.get(
  '/search',
  [
    query('q').optional().isString(),
    query('role').optional().isIn(['admin', 'member', 'trainer']),
  ],
  validate,
  searchUsers
);

// GET /api/users/:id - Obtener usuario
router.get('/:id', getUserById);

// PUT /api/users/:id - Actualizar perfil
router.put(
  '/:id',
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim().notEmpty(),
  ],
  validate,
  updateUser
);

// DELETE /api/users/:id - Eliminar usuario (admin only)
router.delete('/:id', authorizeRoles('admin'), deleteUser);

// PUT /api/users/:id/avatar - Actualizar foto de perfil
router.put(
  '/:id/avatar',
  [
    body('avatar').notEmpty().withMessage('La URL del avatar es requerida'),
  ],
  validate,
  updateAvatar
);

export default router;
