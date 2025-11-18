/**
 * Sistema de logging para los microservicios
 */
class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'SERVICE') {
    this.serviceName = serviceName;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${this.serviceName}] [${level}] ${message}${metaStr}`;
  }

  public info(message: string, meta?: any): void {
    console.log(this.formatMessage('INFO', message, meta));
  }

  public error(message: string, error?: any): void {
    const errorMeta = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(this.formatMessage('ERROR', message, errorMeta));
  }

  public warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('WARN', message, meta));
  }

  public debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }

  public success(message: string, meta?: any): void {
    console.log(this.formatMessage('SUCCESS', message, meta));
  }
}

export default Logger;
