import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth-utils'
import type { User, UserRole } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')

    // Verificar si el usuario ya existe
    const existingUser = await db.collection<User>('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'El correo electrónico ya está registrado' },
        { status: 400 }
      )
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password)

    // Crear nuevo usuario
    const newUser: Omit<User, '_id'> = {
      email,
      password: hashedPassword,
      name,
      role: (role as UserRole) || 'CLIENT',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<User>('users').insertOne(newUser as User)

    // Retornar usuario sin la contraseña
    const userResponse = {
      id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      message: 'Usuario registrado exitosamente',
    })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al registrar usuario',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
