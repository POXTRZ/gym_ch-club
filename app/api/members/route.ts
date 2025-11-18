import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { User, Membership, MemberStats } from '@/lib/types'

// GET /api/members - Obtener todos los miembros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Construir filtro
    const filter: any = {}
    if (role) filter.role = role
    if (status === 'active') filter.isActive = true
    if (status === 'inactive') filter.isActive = false

    const users = await db.collection<User>('users')
      .find(filter, { projection: { password: 0 } }) // Excluir contraseña
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Error al obtener miembros:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener miembros' },
      { status: 500 }
    )
  }
}
