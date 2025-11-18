import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import type { MembershipPlan } from '@/lib/types'

// PUT /api/membership-plans/[id] - Actualizar plan
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
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

    const updateData = {
      name,
      type,
      price: parseFloat(price),
      durationDays: parseInt(durationDays),
      benefits,
      updatedAt: new Date()
    }

    const result = await db.collection<MembershipPlan>('membership_plans').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { _id: params.id, ...updateData },
    })
  } catch (error) {
    console.error('Error al actualizar plan:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/membership-plans/[id] - Eliminar plan (soft delete)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Verificar si hay membresías activas con este plan
    const activeMemberships = await db.collection('memberships').countDocuments({
      planId: new ObjectId(params.id),
      status: 'ACTIVE'
    })

    if (activeMemberships > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se puede eliminar. Hay ${activeMemberships} membresía(s) activa(s) con este plan.` 
        },
        { status: 400 }
      )
    }

    // Soft delete: marcar como inactivo en lugar de eliminar
    const result = await db.collection<MembershipPlan>('membership_plans').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Plan eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error al eliminar plan:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar plan' },
      { status: 500 }
    )
  }
}
