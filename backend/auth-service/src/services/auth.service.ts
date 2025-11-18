import jwt from 'jsonwebtoken';
import User, { IUser } from '../../../shared/models/User';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../../shared/utils/errors';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: 'admin' | 'member' | 'trainer';
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'super_secret_key_change_in_production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   * Generar JWT token
   */
  private generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { id: userId, email, role },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions
    );
  }

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData) {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    // Crear usuario
    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'member',
    });

    // Generar token
    const token = this.generateToken(user._id.toString(), user.email, user.role);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  /**
   * Login de usuario
   */
  async login(email: string, password: string) {
    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Verificar si está activo
    if (!user.isActive) {
      throw new AuthenticationError('Cuenta desactivada');
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(user._id.toString(), user.email, user.role);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(oldToken: string) {
    try {
      const decoded = jwt.verify(oldToken, this.jwtSecret) as {
        id: string;
        email: string;
        role: string;
      };

      // Verificar que el usuario aún existe y está activo
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new AuthenticationError('Usuario no válido');
      }

      // Generar nuevo token
      const newToken = this.generateToken(user._id.toString(), user.email, user.role);

      return {
        token: newToken,
      };
    } catch (error) {
      throw new AuthenticationError('Token inválido o expirado');
    }
  }
}
