import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

interface Exercise {
  _id?: ObjectId
  name: string
  equipment: string // máquina o material (mancuernas, banca, etc.)
  category?: string // opcional: cardio, fuerza, flexibilidad, etc.
  description?: string
  imageUrl?: string // URL de la imagen de referencia
  createdAt: Date
}

// GET - Obtener ejercicios
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const exercisesCollection = db.collection<Exercise>('exercises')

    const filter: any = {}
    if (category) filter.category = category

    const exercises = await exercisesCollection
      .find(filter)
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ success: true, data: exercises })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener ejercicios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo ejercicio
export async function POST(req: NextRequest) {
  try {
    const { name, equipment, category, description, imageUrl } = await req.json()

    if (!name || !equipment) {
      return NextResponse.json(
        { success: false, error: 'Nombre y equipo son requeridos' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const exercisesCollection = db.collection<Exercise>('exercises')

    // Verificar si ya existe
    const existingExercise = await exercisesCollection.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    })

    if (existingExercise) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un ejercicio con ese nombre' },
        { status: 400 }
      )
    }

    const newExercise: Exercise = {
      name,
      equipment,
      category: category || 'General',
      description: description || '',
      imageUrl: imageUrl || '',
      createdAt: new Date(),
    }

    const result = await exercisesCollection.insertOne(newExercise)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newExercise },
    })
  } catch (error) {
    console.error('Error creating exercise:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear ejercicio' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar ejercicio
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de ejercicio requerido' },
        { status: 400 }
      )
    }

    const { name, equipment, category, description, imageUrl } = await req.json()

    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const exercisesCollection = db.collection<Exercise>('exercises')

    const updateData: any = {}
    if (name) updateData.name = name
    if (equipment) updateData.equipment = equipment
    if (category) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl

    const result = await exercisesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Ejercicio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Ejercicio actualizado correctamente',
    })
  } catch (error) {
    console.error('Error updating exercise:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar ejercicio' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar ejercicio
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de ejercicio requerido' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const exercisesCollection = db.collection<Exercise>('exercises')

    const result = await exercisesCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Ejercicio no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Ejercicio eliminado correctamente',
    })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar ejercicio' },
      { status: 500 }
    )
  }
}
