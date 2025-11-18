import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  description: string;
  trainerId: mongoose.Types.ObjectId;
  schedule: {
    dayOfWeek: number; // 0 = Domingo, 6 = Sábado
    startTime: string; // Formato "HH:mm"
    endTime: string;
  }[];
  capacity: number;
  duration: number; // Duración en minutos
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la clase es requerido'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El entrenador es requerido'],
      index: true,
    },
    schedule: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 6,
        },
        startTime: {
          type: String,
          required: true,
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)'],
        },
        endTime: {
          type: String,
          required: true,
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)'],
        },
      },
    ],
    capacity: {
      type: Number,
      required: [true, 'La capacidad es requerida'],
      min: [1, 'La capacidad debe ser al menos 1'],
    },
    duration: {
      type: Number,
      required: [true, 'La duración es requerida'],
      min: [15, 'La duración mínima es 15 minutos'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimización
ClassSchema.index({ trainerId: 1 });
ClassSchema.index({ isActive: 1 });
ClassSchema.index({ level: 1 });
ClassSchema.index({ 'schedule.dayOfWeek': 1 });

export default mongoose.model<IClass>('Class', ClassSchema);
