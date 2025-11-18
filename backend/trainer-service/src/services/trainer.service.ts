import Trainer from '../../../shared/models/Trainer';
import User from '../../../shared/models/User';
import Class from '../../../shared/models/Class';
import { NotFoundError, BadRequestError } from '../../../shared/utils/errors';

export class TrainerService {
  async getAllTrainers() {
    const trainers = await Trainer.find({ isActive: true })
      .populate('userId', 'firstName lastName email phone avatar')
      .sort({ averageRating: -1 });
    return trainers;
  }

  async createTrainer(data: any) {
    // Verificar que el usuario existe y es trainer
    const user = await User.findById(data.userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    if (user.role !== 'trainer') {
      throw new BadRequestError('El usuario debe tener rol de entrenador');
    }

    // Verificar que no existe ya un perfil de trainer para este usuario
    const existingTrainer = await Trainer.findOne({ userId: data.userId });
    if (existingTrainer) {
      throw new BadRequestError('Ya existe un perfil de entrenador para este usuario');
    }

    const trainer = await Trainer.create({
      userId: data.userId,
      specialties: data.specialties,
      bio: data.bio,
      certifications: data.certifications || [],
      availability: data.availability || [],
      isActive: true,
    });

    await trainer.populate('userId', 'firstName lastName email phone avatar');
    return trainer;
  }

  async getTrainerById(trainerId: string) {
    const trainer = await Trainer.findById(trainerId)
      .populate('userId', 'firstName lastName email phone avatar');

    if (!trainer) {
      throw new NotFoundError('Entrenador no encontrado');
    }

    return trainer;
  }

  async updateTrainer(trainerId: string, updateData: any) {
    const trainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phone avatar');

    if (!trainer) {
      throw new NotFoundError('Entrenador no encontrado');
    }

    return trainer;
  }

  async getTrainerSchedule(trainerId: string) {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      throw new NotFoundError('Entrenador no encontrado');
    }

    // Obtener clases del entrenador
    const classes = await Class.find({
      trainerId: trainer.userId,
      isActive: true,
    }).select('name schedule capacity duration level');

    return {
      trainerId: trainer._id,
      availability: trainer.availability,
      classes,
    };
  }

  async getTrainerRatings(trainerId: string) {
    const trainer = await Trainer.findById(trainerId)
      .populate('ratings.userId', 'firstName lastName avatar');

    if (!trainer) {
      throw new NotFoundError('Entrenador no encontrado');
    }

    return {
      trainerId: trainer._id,
      averageRating: trainer.averageRating,
      totalRatings: trainer.ratings.length,
      ratings: trainer.ratings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };
  }
}
