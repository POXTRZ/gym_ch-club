import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { CheckIn } from '@/lib/types'

// GET /api/check-ins - Obtener check-ins
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const today = searchParams.get('today')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const filter: any = {}
    if (userId) filter.userId = new ObjectId(userId)
    if (today === 'true') {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      filter.checkInTime = { $gte: startOfDay }
    }

    const checkIns = await db.collection<CheckIn>('check_ins')
      .find(filter)
      .sort({ checkInTime: -1 })
      .limit(100)
      .toArray()

    // Poblar información de usuarios
    const checkInsWithUsers = await Promise.all(
      checkIns.map(async (checkIn) => {
        const user = await db.collection('users').findOne(
          { _id: checkIn.userId },
          { projection: { name: 1, email: 1 } }
        )
        return {
          ...checkIn,
          userName: user?.name,
          userEmail: user?.email,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: checkInsWithUsers,
    })
  } catch (error) {
    console.error('Error al obtener check-ins:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener check-ins' },
      { status: 500 }
    )
  }
}

// POST /api/check-ins - Registrar check-in
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, employeeId } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Verificar si ya hay un check-in activo (sin checkout)
    const activeCheckIn = await db.collection<CheckIn>('check_ins').findOne({
      userId: new ObjectId(userId),
      checkOutTime: { $exists: false },
    })

    if (activeCheckIn) {
      return NextResponse.json(
        { success: false, error: 'Ya tienes un check-in activo' },
        { status: 400 }
      )
    }

    const newCheckIn: Omit<CheckIn, '_id'> = {
      userId: new ObjectId(userId),
      checkInTime: new Date(),
      employeeId: employeeId ? new ObjectId(employeeId) : undefined,
      createdAt: new Date(),
    }

    const result = await db.collection<CheckIn>('check_ins').insertOne(newCheckIn as CheckIn)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newCheckIn },
      message: 'Check-in registrado exitosamente',
    })
  } catch (error) {
    console.error('Error al registrar check-in:', error)
    return NextResponse.json(
      { success: false, error: 'Error al registrar check-in' },
      { status: 500 }
    )
  }
}

// PUT /api/check-ins - Registrar check-out
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { checkInId } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const result = await db.collection<CheckIn>('check_ins').updateOne(
      { _id: new ObjectId(checkInId), checkOutTime: { $exists: false } },
      { $set: { checkOutTime: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Check-in no encontrado o ya tiene check-out' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Check-out registrado exitosamente',
    })
  } catch (error) {
    console.error('Error al registrar check-out:', error)
    return NextResponse.json(
      { success: false, error: 'Error al registrar check-out' },
      { status: 500 }
    )
  }
}
