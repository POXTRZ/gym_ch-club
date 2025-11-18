import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Routine } from '@/lib/types'

// GET /api/routines - Obtener rutinas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientIdOrEmail = searchParams.get('clientId') || searchParams.get('userId')
    const trainerIdOrEmail = searchParams.get('trainerId')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const filter: any = { isActive: true }
    
    // Buscar clientId si se proporciona
    if (clientIdOrEmail) {
      let clientId: ObjectId
      
      if (ObjectId.isValid(clientIdOrEmail)) {
        clientId = new ObjectId(clientIdOrEmail)
      } else {
        const user = await db.collection('users').findOne({ email: clientIdOrEmail })
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'Cliente no encontrado' },
            { status: 404 }
          )
        }
        clientId = user._id as ObjectId
      }
      
      filter.clientId = clientId
    }
    
    // Buscar trainerId si se proporciona
    if (trainerIdOrEmail) {
      let trainerId: ObjectId
      
      if (ObjectId.isValid(trainerIdOrEmail)) {
        trainerId = new ObjectId(trainerIdOrEmail)
      } else {
        const user = await db.collection('users').findOne({ email: trainerIdOrEmail })
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'Entrenador no encontrado' },
            { status: 404 }
          )
        }
        trainerId = user._id as ObjectId
      }
      
      filter.trainerId = trainerId
    }

    const routines = await db.collection<Routine>('routines')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    // Poblar info de cliente y entrenador
    const routinesWithDetails = await Promise.all(
      routines.map(async (routine) => {
        const clientUser = await db.collection('users').findOne(
          { _id: routine.clientId },
          { projection: { name: 1, email: 1 } }
        )
        const trainerUser = await db.collection('users').findOne(
          { _id: routine.trainerId },
          { projection: { name: 1 } }
        )
        return {
          ...routine,
          clientName: clientUser?.name,
          trainerName: trainerUser?.name,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: routinesWithDetails,
    })
  } catch (error) {
    console.error('Error al obtener rutinas:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener rutinas' },
      { status: 500 }
    )
  }
}

// POST /api/routines - Crear rutina
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientId: clientIdOrEmail, trainerId: trainerIdOrEmail, name, description, days } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Buscar clientId
    let clientId: ObjectId
    
    if (ObjectId.isValid(clientIdOrEmail)) {
      clientId = new ObjectId(clientIdOrEmail)
    } else {
      const user = await db.collection('users').findOne({ email: clientIdOrEmail })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Cliente no encontrado' },
          { status: 404 }
        )
      }
      clientId = user._id as ObjectId
    }

    // Buscar trainerId
    let trainerId: ObjectId
    
    if (ObjectId.isValid(trainerIdOrEmail)) {
      trainerId = new ObjectId(trainerIdOrEmail)
    } else {
      const user = await db.collection('users').findOne({ email: trainerIdOrEmail })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Entrenador no encontrado' },
          { status: 404 }
        )
      }
      trainerId = user._id as ObjectId
    }

    const newRoutine: Omit<Routine, '_id'> = {
      clientId,
      trainerId,
      name,
      description,
      days,
      startDate: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Routine>('routines').insertOne(newRoutine as Routine)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newRoutine },
      message: 'Rutina creada exitosamente',
    })
  } catch (error) {
    console.error('Error al crear rutina:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear rutina' },
      { status: 500 }
    )
  }
}

// PUT /api/routines - Actualizar rutina
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { _id, ...updates } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const result = await db.collection<Routine>('routines').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updates, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Rutina no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Rutina actualizada exitosamente',
    })
  } catch (error) {
    console.error('Error al actualizar rutina:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar rutina' },
      { status: 500 }
    )
  }
}
