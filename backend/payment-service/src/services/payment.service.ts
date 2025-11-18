import Payment from '../../../shared/models/Payment';
import Membership from '../../../shared/models/Membership';
import { NotFoundError, BadRequestError } from '../../../shared/utils/errors';

export class PaymentService {
  async processPayment(data: any) {
    const payment = await Payment.create({
      userId: data.userId,
      membershipId: data.membershipId,
      amount: data.amount,
      currency: data.currency || 'USD',
      status: 'pending',
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      description: data.description,
      metadata: data.metadata || {},
    });

    // Simular procesamiento de pago
    if (data.paymentMethod === 'cash') {
      payment.status = 'completed';
      await payment.save();
    }

    return payment;
  }

  async getPaymentById(paymentId: string) {
    const payment = await Payment.findById(paymentId)
      .populate('userId', 'firstName lastName email')
      .populate('membershipId');
    
    if (!payment) {
      throw new NotFoundError('Pago no encontrado');
    }
    
    return payment;
  }

  async getUserPayments(userId: string) {
    const payments = await Payment.find({ userId })
      .populate('membershipId')
      .sort({ createdAt: -1 });
    
    return payments;
  }

  async handleWebhook(webhookData: any) {
    // Lógica para manejar webhooks de Stripe/MercadoPago
    const { transactionId, status } = webhookData;
    
    if (!transactionId) {
      throw new BadRequestError('Transaction ID requerido');
    }

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundError('Pago no encontrado');
    }

    // Actualizar estado del pago
    payment.status = status || payment.status;
    await payment.save();

    return payment;
  }

  async generateInvoice(paymentId: string) {
    const payment = await Payment.findById(paymentId)
      .populate('userId', 'firstName lastName email')
      .populate('membershipId');
    
    if (!payment) {
      throw new NotFoundError('Pago no encontrado');
    }

    // En una implementación real, aquí se generaría un PDF
    const invoice = {
      invoiceNumber: `INV-${payment._id}`,
      paymentId: payment._id,
      date: payment.createdAt,
      customer: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      description: payment.description,
      // URL del PDF generado
      pdfUrl: `/invoices/${payment._id}.pdf`,
    };

    return invoice;
  }

  async processRefund(paymentId: string, reason: string) {
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (payment.status !== 'completed') {
      throw new BadRequestError('Solo se pueden reembolsar pagos completados');
    }

    payment.status = 'refunded';
    payment.metadata = {
      ...payment.metadata,
      refundReason: reason,
      refundDate: new Date(),
    };
    
    await payment.save();
    return payment;
  }
}
