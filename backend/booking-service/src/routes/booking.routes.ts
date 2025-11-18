import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken } from '../../../shared/middleware/auth.middleware';
import {
  createBooking,
  getBookingById,
  getUserBookings,
  getClassBookings,
  cancelBooking,
  getUpcomingBookings,
} from '../controllers/booking.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/bookings - Reservar clase
router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('El usuario es requerido'),
    body('classId').notEmpty().withMessage('La clase es requerida'),
    body('bookingDate').isISO8601().withMessage('Fecha inválida'),
    body('notes').optional().isString(),
  ],
  validate,
  createBooking
);

// GET /api/bookings/:id - Detalles de reserva
router.get('/:id', getBookingById);

// GET /api/bookings/user/:userId - Reservas del usuario
router.get('/user/:userId', getUserBookings);

// GET /api/bookings/user/:userId/upcoming - Próximas reservas
router.get('/user/:userId/upcoming', getUpcomingBookings);

// GET /api/bookings/class/:classId - Reservas de una clase
router.get('/class/:classId', getClassBookings);

// PUT /api/bookings/:id/cancel - Cancelar reserva
router.put('/:id/cancel', cancelBooking);

export default router;
