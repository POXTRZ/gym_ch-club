import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyPassword } from '@/lib/auth-utils'
import type { User } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Buscar usuario
    const user = await db.collection<User>('users').findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Usuario inactivo. Contacta al administrador' },
        { status: 403 }
      )
    }

    // Retornar usuario sin la contraseña
    const userResponse = {
      id: user._id?.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'Inicio de sesión exitoso',
    })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al iniciar sesión',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
