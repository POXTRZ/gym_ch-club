import { Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const paymentService = new PaymentService();

export const processPayment = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const paymentData = req.body;
  const payment = await paymentService.processPayment(paymentData);
  res.status(201).json({
    success: true,
    data: payment,
    message: 'Pago procesado exitosamente',
  });
});

export const getPaymentById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const payment = await paymentService.getPaymentById(id);
  res.status(200).json({
    success: true,
    data: payment,
  });
});

export const getUserPayments = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { userId } = req.params;
  const payments = await paymentService.getUserPayments(userId);
  res.status(200).json({
    success: true,
    data: payments,
    count: payments.length,
  });
});

export const handleWebhook = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const webhookData = req.body;
  await paymentService.handleWebhook(webhookData);
  res.status(200).json({
    success: true,
    message: 'Webhook procesado exitosamente',
  });
});

export const generateInvoice = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const invoice = await paymentService.generateInvoice(id);
  res.status(200).json({
    success: true,
    data: invoice,
    message: 'Factura generada exitosamente',
  });
});

export const processRefund = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const payment = await paymentService.processRefund(id, reason);
  res.status(200).json({
    success: true,
    data: payment,
    message: 'Reembolso procesado exitosamente',
  });
});
