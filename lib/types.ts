import { ObjectId } from 'mongodb'

// ============================================
// TIPOS DE USUARIOS Y AUTENTICACIÓN
// ============================================

export type UserRole = 'CLIENT' | 'EMPLOYEE' | 'TRAINER' | 'ADMIN'

export interface User {
  _id?: ObjectId
  email: string
  password: string // Hashed
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// ============================================
// MEMBRESÍAS
// ============================================

export type MembershipPlanType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
export type MembershipStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED'

export interface MembershipPlan {
  _id?: ObjectId
  name: string
  type: MembershipPlanType
  price: number
  durationDays: number
  benefits: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Membership {
  _id?: ObjectId
  userId: ObjectId
  planId: ObjectId
  startDate: Date
  endDate: Date
  status: MembershipStatus
  paymentId?: ObjectId
  autoRenewal: boolean
  createdAt: Date
  updatedAt: Date
}

// ============================================
// RUTINAS Y EJERCICIOS
// ============================================

export interface Exercise {
  name: string
  sets: number
  reps: string // Puede ser "10" o "10-12" o "AMRAP"
  rest: string // "60s", "90s", etc
  equipment?: string // máquina o material
  notes?: string
}

export interface RoutineDay {
  dayName: string // "Lunes", "Martes", etc
  exercises: Exercise[]
  notes?: string
}

export interface Routine {
  _id?: ObjectId
  clientId: ObjectId
  trainerId: ObjectId
  name: string
  description: string
  days: RoutineDay[]
  startDate: Date
  endDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  clientName?: string // Populated
  trainerName?: string // Populated
}

// ============================================
// PROGRESO FÍSICO
// ============================================

export interface PhysicalProgress {
  _id?: ObjectId
  userId: ObjectId
  date: Date
  weight: number // kg
  bodyFat?: number // percentage
  muscleMass?: number // kg
  measurements?: {
    chest?: number // cm
    waist?: number // cm
    hips?: number // cm
    arms?: number // cm
    legs?: number // cm
  }
  photos?: string[] // URLs
  notes?: string
  createdAt: Date
}

// ============================================
// CHECK-INS / ASISTENCIA
// ============================================

export interface CheckIn {
  _id?: ObjectId
  userId: ObjectId
  checkInTime: Date
  checkOutTime?: Date
  employeeId?: ObjectId // Quien registró el check-in
  notes?: string
  createdAt: Date
}

// ============================================
// PAGOS
// ============================================

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type PaymentType = 'MEMBERSHIP' | 'PRODUCT' | 'SERVICE' | 'OTHER'

export interface Payment {
  _id?: ObjectId
  userId: ObjectId
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  type: PaymentType
  description: string
  membershipId?: ObjectId
  productIds?: ObjectId[]
  processedBy?: ObjectId // Employee/Admin ID
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

// ============================================
// INVENTARIO / PRODUCTOS
// ============================================

export type ProductCategory = 'SUPPLEMENT' | 'EQUIPMENT' | 'APPAREL' | 'ACCESSORY' | 'OTHER'

export interface Product {
  _id?: ObjectId
  name: string
  description: string
  category: ProductCategory
  price: number
  cost: number // Precio de costo
  stock: number
  minStock: number // Alerta cuando stock < minStock
  images?: string[]
  barcode?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Sale {
  _id?: ObjectId
  productId: ObjectId
  quantity: number
  unitPrice: number
  totalPrice: number
  customerId?: ObjectId
  employeeId: ObjectId
  paymentId?: ObjectId
  createdAt: Date
}

// ============================================
// REPORTES Y ESTADÍSTICAS
// ============================================

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  expiredMembers: number
  newMembersThisMonth: number
  
  totalRevenue?: number
  monthlyRevenue: number
  revenueGrowth: number
  
  checkInsToday: number
  checkInsThisMonth: number
  
  productSales: number
  lowStockProducts: number
  
  totalEmployees: number
  totalTrainers: number
  activeRoutines: number
  
  salesByDay: Array<{
    date: string
    day: string
    sales: number
    count: number
  }>
  
  peakHours: Array<{
    hour: string
    count: number
  }>
  
  recentActivities: Array<{
    type: string
    description: string
    time: Date
  }>
}

export interface MemberStats {
  checkInsThisMonth: number
  checkInsGoal: number
  currentWeight?: number
  weightChange?: number // vs mes anterior
  daysRemaining: number
  nextPaymentDate?: Date
  nextPaymentAmount?: number
}

// ============================================
// TIPOS PARA API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
