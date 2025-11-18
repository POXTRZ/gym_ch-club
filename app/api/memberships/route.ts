import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Membership, MembershipPlan } from '@/lib/types'

// GET /api/memberships - Obtener membresías
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userIdOrEmail = searchParams.get('userId')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const filter: any = {}
    if (userIdOrEmail) {
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
      
      filter.userId = userId
    }

    const memberships = await db.collection<Membership>('memberships')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    // Poblar información del plan
    const membershipsWithPlans = await Promise.all(
      memberships.map(async (membership) => {
        const plan = await db.collection<MembershipPlan>('membership_plans').findOne(
          { _id: membership.planId }
        )
        return {
          ...membership,
          plan,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: membershipsWithPlans,
    })
  } catch (error) {
    console.error('Error al obtener membresías:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener membresías' },
      { status: 500 }
    )
  }
}

// POST /api/memberships - Crear nueva membresía
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId: userIdOrEmail, planId } = body
    
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

    // Obtener el plan
    const plan = await db.collection<MembershipPlan>('membership_plans').findOne({
      _id: new ObjectId(planId)
    })

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.durationDays)

    const newMembership: Omit<Membership, '_id'> = {
      userId,
      planId: new ObjectId(planId),
      startDate,
      endDate,
      status: 'ACTIVE',
      autoRenewal: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Membership>('memberships').insertOne(newMembership as Membership)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newMembership },
      message: 'Membresía creada exitosamente',
    })
  } catch (error) {
    console.error('Error al crear membresía:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear membresía' },
      { status: 500 }
    )
  }
}
