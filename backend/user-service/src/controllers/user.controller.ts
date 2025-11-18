import { Response } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const userService = new UserService();

export const getAllUsers = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users,
    count: users.length,
  });
});

export const getUserById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateUser = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const user = await userService.updateUser(id, updateData);
  res.status(200).json({
    success: true,
    data: user,
    message: 'Usuario actualizado exitosamente',
  });
});

export const deleteUser = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.status(200).json({
    success: true,
    message: 'Usuario eliminado exitosamente',
  });
});

export const updateAvatar = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const { avatar } = req.body;
  
  const user = await userService.updateAvatar(id, avatar);
  res.status(200).json({
    success: true,
    data: user,
    message: 'Avatar actualizado exitosamente',
  });
});

export const searchUsers = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { q, role } = req.query;
  
  const users = await userService.searchUsers(
    q as string,
    role as string
  );
  
  res.status(200).json({
    success: true,
    data: users,
    count: users.length,
  });
});
