import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import type { MembershipPlan } from '@/lib/types'

// GET /api/membership-plans - Obtener planes de membresía
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const plans = await db.collection<MembershipPlan>('membership_plans')
      .find({ isActive: true })
      .sort({ price: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: plans,
    })
  } catch (error) {
    console.error('Error al obtener planes:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener planes' },
      { status: 500 }
    )
  }
}

// POST /api/membership-plans - Crear nuevo plan
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, price, durationDays, benefits } = body

    // Validaciones
    if (!name || !type || !price || !durationDays) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!benefits || benefits.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debe incluir al menos un beneficio' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const newPlan: Omit<MembershipPlan, '_id'> = {
      name,
      type,
      price: parseFloat(price),
      durationDays: parseInt(durationDays),
      benefits,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection<MembershipPlan>('membership_plans').insertOne(newPlan as MembershipPlan)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newPlan },
    })
  } catch (error) {
    console.error('Error al crear plan:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear plan' },
      { status: 500 }
    )
  }
}
