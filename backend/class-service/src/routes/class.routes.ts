import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import {
  getAllClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  getWeeklySchedule,
  getTrainerClasses,
} from '../controllers/class.controller';

const router = Router();

// GET /api/classes - Listar todas las clases
router.get('/', getAllClasses);

// GET /api/classes/schedule - Horario semanal completo
router.get('/schedule', getWeeklySchedule);

// GET /api/classes/trainer/:trainerId - Clases por entrenador
router.get('/trainer/:trainerId', getTrainerClasses);

// Las siguientes rutas requieren autenticación
router.use(authenticateToken);

// POST /api/classes - Crear clase (admin/trainer)
router.post(
  '/',
  authorizeRoles('admin', 'trainer'),
  [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    body('trainerId').notEmpty().withMessage('El entrenador es requerido'),
    body('schedule').isArray().withMessage('El horario debe ser un array'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacidad inválida'),
    body('duration').isInt({ min: 15 }).withMessage('Duración inválida'),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all']),
  ],
  validate,
  createClass
);

// GET /api/classes/:id - Detalles de clase
router.get('/:id', getClassById);

// PUT /api/classes/:id - Actualizar clase
router.put('/:id', authorizeRoles('admin', 'trainer'), updateClass);

// DELETE /api/classes/:id - Eliminar clase
router.delete('/:id', authorizeRoles('admin'), deleteClass);

export default router;
