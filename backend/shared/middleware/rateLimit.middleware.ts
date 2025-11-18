import rateLimit from 'express-rate-limit';

/**
 * Rate limiter para endpoints autenticados
 * Previene abuso de la API incluso con autenticación válida
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 solicitudes por ventana
  message: 'Demasiadas solicitudes desde esta IP, intente de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter estricto para endpoints de autenticación
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de autenticación, intente de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
