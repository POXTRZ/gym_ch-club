import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { PhysicalProgress } from '@/lib/types'

// GET /api/progress - Obtener progreso físico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdOrEmail = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    if (!userIdOrEmail) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Buscar el usuario primero (puede ser email u ObjectId)
    let userId: ObjectId
    
    if (ObjectId.isValid(userIdOrEmail)) {
      userId = new ObjectId(userIdOrEmail)
    } else {
      // Es un email, buscar el usuario
      const user = await db.collection('users').findOne({ email: userIdOrEmail })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }
      userId = user._id as ObjectId
    }

    const progress = await db.collection<PhysicalProgress>('physical_progress')
      .find({ userId })
      .sort({ date: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      data: progress,
    })
  } catch (error) {
    console.error('Error al obtener progreso:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener progreso' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Registrar progreso
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId: userIdOrEmail, weight, bodyFat, muscleMass, measurements, notes } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Buscar el usuario primero
    let userId: ObjectId
    
    if (ObjectId.isValid(userIdOrEmail)) {
      userId = new ObjectId(userIdOrEmail)
    } else {
      // Es un email, buscar el usuario
      const user = await db.collection('users').findOne({ email: userIdOrEmail })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }
      userId = user._id as ObjectId
    }

    const newProgress: Omit<PhysicalProgress, '_id'> = {
      userId,
      date: new Date(),
      weight,
      bodyFat,
      muscleMass,
      measurements,
      notes,
      createdAt: new Date(),
    }

    const result = await db.collection<PhysicalProgress>('physical_progress').insertOne(newProgress as PhysicalProgress)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newProgress },
      message: 'Progreso registrado exitosamente',
    })
  } catch (error) {
    console.error('Error al registrar progreso:', error)
    return NextResponse.json(
      { success: false, error: 'Error al registrar progreso' },
      { status: 500 }
    )
  }
}
