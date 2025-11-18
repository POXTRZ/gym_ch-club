import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// PUT /api/user/profile - Actualizar perfil de usuario
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { email, name, phone } = body

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const updateData: any = {
      name,
      updatedAt: new Date()
    }

    if (phone !== undefined) {
      updateData.phone = phone
    }

    const result = await db.collection('users').updateOne(
      { email },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar perfil' },
      { status: 500 }
    )
  }
}
