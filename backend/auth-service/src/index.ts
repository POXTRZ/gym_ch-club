import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from '../../shared/utils/db';
import Logger from '../../shared/utils/logger';
import { errorHandler, notFoundHandler } from '../../shared/middleware/errorHandler.middleware';
import authRoutes from './routes/auth.routes';

// Cargar variables de entorno
dotenv.config();

const logger = new Logger('AUTH-SERVICE');
const app: Express = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

// Middlewares
app.use(helmet()); // Seguridad
app.use(cors()); // CORS
app.use(morgan('dev')); // Logging HTTP
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: 'auth-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Rutas
app.use('/api/auth', authRoutes);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await db.connect();
    
    app.listen(PORT, () => {
      logger.success(`Servidor escuchando en puerto ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();

// Manejo de errores no capturados
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
