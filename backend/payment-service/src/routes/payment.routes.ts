import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validation.middleware';
import { authenticateToken, authorizeRoles } from '../../../shared/middleware/auth.middleware';
import { apiLimiter } from '../../../shared/middleware/rateLimit.middleware';
import {
  processPayment,
  getPaymentById,
  getUserPayments,
  handleWebhook,
  generateInvoice,
  processRefund,
} from '../controllers/payment.controller';

const router = Router();

// POST /api/payments/webhook - Webhook (público)
router.post('/webhook', handleWebhook);

// Las siguientes rutas requieren autenticación y rate limiting
router.use(apiLimiter);
router.use(authenticateToken);

// POST /api/payments - Procesar pago
router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('El usuario es requerido'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Monto inválido'),
    body('paymentMethod')
      .isIn(['credit_card', 'debit_card', 'cash', 'transfer', 'mercadopago', 'stripe'])
      .withMessage('Método de pago inválido'),
    body('currency').optional().isString(),
    body('membershipId').optional().isString(),
  ],
  validate,
  processPayment
);

// GET /api/payments/:id - Detalles de pago
router.get('/:id', getPaymentById);

// GET /api/payments/user/:userId - Historial de pagos
router.get('/user/:userId', getUserPayments);

// GET /api/payments/:id/invoice - Generar factura
router.get('/:id/invoice', generateInvoice);

// POST /api/payments/:id/refund - Procesar reembolso (admin)
router.post(
  '/:id/refund',
  authorizeRoles('admin'),
  [
    body('reason').notEmpty().withMessage('La razón del reembolso es requerida'),
  ],
  validate,
  processRefund
);

export default router;
