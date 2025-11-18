import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const authService = new AuthService();

/**
 * Controlador para registro de usuarios
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  const result = await authService.register({
    email,
    password,
    firstName,
    lastName,
    phone,
    role,
  });

  res.status(201).json({
    success: true,
    data: result,
    message: 'Usuario registrado exitosamente',
  });
});

/**
 * Controlador para login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Login exitoso',
  });
});

/**
 * Controlador para obtener usuario actual
 */
export const getCurrentUser = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const userId = req.user!.id;

  const user = await authService.getUserById(userId);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Controlador para logout
 */
export const logout = asyncHandler(async (req: IAuthRequest, res: Response) => {
  // En una implementación más completa, aquí se invalidaría el token
  // Por ahora, solo confirmamos el logout
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  });
});

/**
 * Controlador para refresh token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshToken(refreshToken);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Token renovado exitosamente',
  });
});
