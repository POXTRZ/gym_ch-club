import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import { apiLimiter } from '../../../shared/middleware/rateLimit.middleware';
import {
  getAllTrainers,
  createTrainer,
  getTrainerById,
  updateTrainer,
  getTrainerSchedule,
  getTrainerRatings,
} from '../controllers/trainer.controller';

const router = Router();

// GET /api/trainers - Listar entrenadores (público)
router.get('/', getAllTrainers);

// GET /api/trainers/:id - Detalles de entrenador (público)
router.get('/:id', getTrainerById);

// GET /api/trainers/:id/schedule - Horario del entrenador (público)
router.get('/:id/schedule', getTrainerSchedule);

// GET /api/trainers/:id/ratings - Calificaciones (público)
router.get('/:id/ratings', getTrainerRatings);

// Las siguientes rutas requieren autenticación y rate limiting
router.use(apiLimiter);
router.use(authenticateToken);

// POST /api/trainers - Crear perfil de entrenador
router.post(
  '/',
  authorizeRoles('admin'),
  [
    body('userId').notEmpty().withMessage('El usuario es requerido'),
    body('specialties').isArray().withMessage('Las especialidades deben ser un array'),
    body('bio').notEmpty().withMessage('La biografía es requerida'),
    body('certifications').optional().isArray(),
    body('availability').optional().isArray(),
  ],
  validate,
  createTrainer
);

// PUT /api/trainers/:id - Actualizar perfil
router.put('/:id', authorizeRoles('admin', 'trainer'), updateTrainer);

export default router;
