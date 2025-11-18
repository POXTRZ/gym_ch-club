import mongoose, { Schema, Document } from 'mongoose';

export interface IMembership extends Document {
  userId: mongoose.Types.ObjectId;
  planType: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  price: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es requerido'],
      index: true,
    },
    planType: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      required: [true, 'El tipo de plan es requerido'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active',
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'La fecha de fin es requerida'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio debe ser mayor a 0'],
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimización
MembershipSchema.index({ userId: 1, status: 1 });
MembershipSchema.index({ endDate: 1 });
MembershipSchema.index({ planType: 1 });

// Método para verificar si la membresía está activa
MembershipSchema.methods.isCurrentlyActive = function (): boolean {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.endDate >= now
  );
};

export default mongoose.model<IMembership>('Membership', MembershipSchema);
