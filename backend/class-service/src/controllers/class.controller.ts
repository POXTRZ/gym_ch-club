import { Response } from 'express';
import { ClassService } from '../services/class.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const classService = new ClassService();

export const getAllClasses = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const classes = await classService.getAllClasses();
  res.status(200).json({
    success: true,
    data: classes,
    count: classes.length,
  });
});

export const createClass = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const classData = req.body;
  const newClass = await classService.createClass(classData);
  res.status(201).json({
    success: true,
    data: newClass,
    message: 'Clase creada exitosamente',
  });
});

export const getClassById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const classData = await classService.getClassById(id);
  res.status(200).json({
    success: true,
    data: classData,
  });
});

export const updateClass = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const classData = await classService.updateClass(id, updateData);
  res.status(200).json({
    success: true,
    data: classData,
    message: 'Clase actualizada exitosamente',
  });
});

export const deleteClass = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await classService.deleteClass(id);
  res.status(200).json({
    success: true,
    message: 'Clase eliminada exitosamente',
  });
});

export const getWeeklySchedule = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const schedule = await classService.getWeeklySchedule();
  res.status(200).json({
    success: true,
    data: schedule,
  });
});

export const getTrainerClasses = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { trainerId } = req.params;
  const classes = await classService.getTrainerClasses(trainerId);
  res.status(200).json({
    success: true,
    data: classes,
    count: classes.length,
  });
});
