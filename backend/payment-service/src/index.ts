import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from '../../shared/utils/db';
import Logger from '../../shared/utils/logger';
import { errorHandler, notFoundHandler } from '../../shared/middleware/errorHandler.middleware';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const logger = new Logger('PAYMENT-SERVICE');
const app: Express = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: 'payment-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/payments', paymentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      logger.success(`Servidor escuchando en puerto ${PORT}`);
    });
  } catch (error) {
    logger.error('Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
