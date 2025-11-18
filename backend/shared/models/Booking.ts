import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'La clase es requerida'],
      index: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'La fecha de reserva es requerida'],
      index: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'confirmed',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Índices compuestos para optimización
BookingSchema.index({ userId: 1, bookingDate: -1 });
BookingSchema.index({ classId: 1, bookingDate: 1 });
BookingSchema.index({ userId: 1, classId: 1, bookingDate: 1 }, { unique: true });
BookingSchema.index({ status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
