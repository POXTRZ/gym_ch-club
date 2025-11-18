import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainer extends Document {
  userId: mongoose.Types.ObjectId;
  specialties: string[];
  bio: string;
  certifications: {
    name: string;
    institution: string;
    year: number;
  }[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  ratings: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
  averageRating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrainerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      unique: true,
      index: true,
    },
    specialties: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'Debe tener al menos una especialidad',
      },
    },
    bio: {
      type: String,
      required: [true, 'La biografía es requerida'],
      maxlength: [1000, 'La biografía no puede exceder 1000 caracteres'],
    },
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1900,
          max: new Date().getFullYear(),
        },
      },
    ],
    availability: [
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
    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          default: '',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
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
TrainerSchema.index({ userId: 1 });
TrainerSchema.index({ isActive: 1 });
TrainerSchema.index({ averageRating: -1 });
TrainerSchema.index({ specialties: 1 });

// Calcular rating promedio antes de guardar
TrainerSchema.pre<ITrainer>('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

export default mongoose.model<ITrainer>('Trainer', TrainerSchema);
