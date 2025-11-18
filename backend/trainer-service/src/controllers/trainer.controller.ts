import { Response } from 'express';
import { TrainerService } from '../services/trainer.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const trainerService = new TrainerService();

export const getAllTrainers = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const trainers = await trainerService.getAllTrainers();
  res.status(200).json({
    success: true,
    data: trainers,
    count: trainers.length,
  });
});

export const createTrainer = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const trainerData = req.body;
  const trainer = await trainerService.createTrainer(trainerData);
  res.status(201).json({
    success: true,
    data: trainer,
    message: 'Perfil de entrenador creado exitosamente',
  });
});

export const getTrainerById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const trainer = await trainerService.getTrainerById(id);
  res.status(200).json({
    success: true,
    data: trainer,
  });
});

export const updateTrainer = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const trainer = await trainerService.updateTrainer(id, updateData);
  res.status(200).json({
    success: true,
    data: trainer,
    message: 'Perfil actualizado exitosamente',
  });
});

export const getTrainerSchedule = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const schedule = await trainerService.getTrainerSchedule(id);
  res.status(200).json({
    success: true,
    data: schedule,
  });
});

export const getTrainerRatings = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const ratings = await trainerService.getTrainerRatings(id);
  res.status(200).json({
    success: true,
    data: ratings,
  });
});
