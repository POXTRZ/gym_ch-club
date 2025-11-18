import User from '../../../shared/models/User';
import { NotFoundError, AuthorizationError } from '../../../shared/utils/errors';

export class UserService {
  async getAllUsers() {
    const users = await User.find({ isActive: true }).select('-password');
    return users;
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return user;
  }

  async updateUser(userId: string, updateData: any) {
    // No permitir actualizar password, role, o email directamente
    const { password, role, email, ...safeData } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: safeData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  async deleteUser(userId: string) {
    // Soft delete: marcar como inactivo
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  async searchUsers(query?: string, role?: string) {
    const filter: any = { isActive: true };

    if (role) {
      filter.role = role;
    }

    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password');
    return users;
  }
}
