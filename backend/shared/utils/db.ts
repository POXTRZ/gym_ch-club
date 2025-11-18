import mongoose from 'mongoose';

/**
 * Configuración de conexión a MongoDB con retry logic
 */
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Conectar a MongoDB con reintentos automáticos
   */
  public async connect(retries: number = 5): Promise<void> {
    if (this.isConnected) {
      console.log('✅ Ya conectado a MongoDB');
      return;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/gym_db?authSource=admin';

    for (let i = 0; i < retries; i++) {
      try {
        await mongoose.connect(mongoUri);
        this.isConnected = true;
        console.log('✅ Conectado a MongoDB exitosamente');
        
        // Event listeners
        mongoose.connection.on('disconnected', () => {
          console.log('⚠️ MongoDB desconectado');
          this.isConnected = false;
        });

        mongoose.connection.on('error', (err: Error) => {
          console.error('❌ Error en MongoDB:', err);
        });

        return;
      } catch (error) {
        console.error(`❌ Intento ${i + 1}/${retries} - Error conectando a MongoDB:`, error);
        
        if (i < retries - 1) {
          const delay = Math.min(1000 * Math.pow(2, i), 10000); // Exponential backoff
          console.log(`⏳ Reintentando en ${delay / 1000} segundos...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error('No se pudo conectar a MongoDB después de varios intentos');
  }

  /**
   * Desconectar de MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Desconectado de MongoDB');
    } catch (error) {
      console.error('❌ Error desconectando de MongoDB:', error);
      throw error;
    }
  }

  /**
   * Obtener estado de conexión
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default Database.getInstance();
