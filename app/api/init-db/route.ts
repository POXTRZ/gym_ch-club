import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth-utils'
import type { User, MembershipPlan, Product } from '@/lib/types'

async function initializeDatabase() {
  const client = await clientPromise
  const db = client.db('gym_ch_club')

  // ============================================
  // CREAR USUARIOS DE PRUEBA
  // ============================================
  const password = await hashPassword('password123')
    
    const demoUsers: Omit<User, '_id'>[] = [
      {
        email: 'admin@chclub.com',
        password,
        name: 'Ana Martínez',
        role: 'ADMIN',
        phone: '5551234567',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'trainer@chclub.com',
        password,
        name: 'Carlos Hernández',
        role: 'TRAINER',
        phone: '5557654321',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'employee@chclub.com',
        password,
        name: 'María García',
        role: 'EMPLOYEE',
        phone: '5559876543',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'client@chclub.com',
        password,
        name: 'Juan Pérez',
        role: 'CLIENT',
        phone: '5553456789',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'laura@chclub.com',
        password,
        name: 'Laura Gómez',
        role: 'CLIENT',
        phone: '5552345678',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

  // Limpiar colección de usuarios
  await db.collection('users').deleteMany({})
  const usersResult = await db.collection<User>('users').insertMany(demoUsers as User[])
  console.log('Usuarios creados:', usersResult.insertedCount)

  // ============================================
  // CREAR PLANES DE MEMBRESÍA
  // ============================================
  const membershipPlans: Omit<MembershipPlan, '_id'>[] = [
      {
        name: 'Pase Diario',
        type: 'DAILY',
        price: 100,
        durationDays: 1,
        benefits: ['Acceso al gimnasio por 1 día', 'Uso de vestidores'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pase Semanal',
        type: 'WEEKLY',
        price: 500,
        durationDays: 7,
        benefits: ['Acceso al gimnasio por 7 días', 'Uso de vestidores', 'Descuento 10% en productos'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Membresía Básica Mensual',
        type: 'MONTHLY',
        price: 800,
        durationDays: 30,
        benefits: ['Acceso ilimitado', 'Uso de vestidores y regaderas', 'Descuento 15% en productos'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Membresía Premium Mensual',
        type: 'MONTHLY',
        price: 1200,
        durationDays: 30,
        benefits: [
          'Acceso ilimitado 24/7',
          'Rutina personalizada',
          'Consulta nutricional',
          'Descuento 20% en productos',
          'Invitado gratis 1 vez al mes'
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Membresía Trimestral',
        type: 'QUARTERLY',
        price: 3000,
        durationDays: 90,
        benefits: ['Acceso ilimitado', 'Rutina personalizada', 'Descuento 20% en productos', '3 meses al precio de 2.5'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Membresía Anual',
        type: 'ANNUAL',
        price: 10000,
        durationDays: 365,
        benefits: [
          'Acceso ilimitado 24/7',
          'Rutina personalizada',
          'Consultas nutricionales ilimitadas',
          'Descuento 25% en productos',
          '2 meses gratis',
          'Invitado gratis ilimitado'
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ]

  await db.collection('membership_plans').deleteMany({})
  const plansResult = await db.collection<MembershipPlan>('membership_plans').insertMany(membershipPlans as MembershipPlan[])
  console.log('Planes de membresía creados:', plansResult.insertedCount)

  // ============================================
  // CREAR PRODUCTOS
  // ============================================
  const products: Omit<Product, '_id'>[] = [
      {
        name: 'Proteína Whey 2kg',
        description: 'Proteína de suero de leche, sabor chocolate',
        category: 'SUPPLEMENT',
        price: 850,
        cost: 550,
        stock: 25,
        minStock: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Creatina 300g',
        description: 'Creatina monohidratada pura',
        category: 'SUPPLEMENT',
        price: 450,
        cost: 280,
        stock: 30,
        minStock: 8,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BCAA 500g',
        description: 'Aminoácidos ramificados, sabor limón',
        category: 'SUPPLEMENT',
        price: 550,
        cost: 350,
        stock: 20,
        minStock: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Guantes de entrenamiento',
        description: 'Guantes acolchados para gimnasio',
        category: 'ACCESSORY',
        price: 250,
        cost: 120,
        stock: 15,
        minStock: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Botella shaker 700ml',
        description: 'Botella mezcladora con compartimento',
        category: 'ACCESSORY',
        price: 150,
        cost: 70,
        stock: 40,
        minStock: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Playera CH Club',
        description: 'Playera deportiva dry-fit, varias tallas',
        category: 'APPAREL',
        price: 350,
        cost: 180,
        stock: 50,
        minStock: 15,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Banda de resistencia',
        description: 'Banda elástica nivel medio',
        category: 'EQUIPMENT',
        price: 200,
        cost: 90,
        stock: 25,
        minStock: 8,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pre-workout 300g',
        description: 'Energizante pre-entrenamiento',
        category: 'SUPPLEMENT',
        price: 600,
        cost: 380,
        stock: 18,
        minStock: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ]

  await db.collection('products').deleteMany({})
  const productsResult = await db.collection<Product>('products').insertMany(products as Product[])
  console.log('Productos creados:', productsResult.insertedCount)

  return {
    users: usersResult.insertedCount,
    membershipPlans: plansResult.insertedCount,
    products: productsResult.insertedCount,
  }
}

// Soportar tanto GET como POST
export async function GET() {
  try {
    const result = await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada con datos de prueba',
      data: result
    })
  } catch (error) {
    console.error('Error al inicializar DB:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al inicializar base de datos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const result = await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada con datos de prueba',
      data: result
    })
  } catch (error) {
    console.error('Error al inicializar DB:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al inicializar base de datos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
