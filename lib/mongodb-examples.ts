/**
 * EJEMPLOS DE USO DE MONGODB EN TU PROYECTO
 * 
 * Copia estos ejemplos en tus API routes según necesites
 */

import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// ============================================
// EJEMPLO 1: Obtener todos los documentos
// ============================================
export async function obtenerTodosLosMiembros() {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  const miembros = await db.collection('miembros').find({}).toArray()
  return miembros
}

// ============================================
// EJEMPLO 2: Obtener un documento por ID
// ============================================
export async function obtenerMiembroPorId(id: string) {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  const miembro = await db.collection('miembros').findOne({
    _id: new ObjectId(id)
  })
  return miembro
}

// ============================================
// EJEMPLO 3: Buscar con filtros
// ============================================
export async function buscarMiembrosActivos() {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  const miembros = await db.collection('miembros').find({
    activo: true,
    membresia: { $ne: null }
  }).toArray()
  return miembros
}

// ============================================
// EJEMPLO 4: Crear un nuevo documento
// ============================================
export async function crearMiembro(data: any) {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  
  const result = await db.collection('miembros').insertOne({
    ...data,
    fechaCreacion: new Date(),
    activo: true
  })
  
  return {
    id: result.insertedId,
    success: true
  }
}

// ============================================
// EJEMPLO 5: Actualizar un documento
// ============================================
export async function actualizarMiembro(id: string, data: any) {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  
  const result = await db.collection('miembros').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...data,
        fechaActualizacion: new Date()
      }
    }
  )
  
  return {
    success: result.modifiedCount > 0,
    modifiedCount: result.modifiedCount
  }
}

// ============================================
// EJEMPLO 6: Eliminar un documento
// ============================================
export async function eliminarMiembro(id: string) {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  
  const result = await db.collection('miembros').deleteOne({
    _id: new ObjectId(id)
  })
  
  return {
    success: result.deletedCount > 0,
    deletedCount: result.deletedCount
  }
}

// ============================================
// EJEMPLO 7: Agregaciones (estadísticas)
// ============================================
export async function obtenerEstadisticas() {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  
  const stats = await db.collection('miembros').aggregate([
    {
      $group: {
        _id: '$membresia',
        total: { $sum: 1 },
        promedioEdad: { $avg: '$edad' }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]).toArray()
  
  return stats
}

// ============================================
// EJEMPLO 8: Uso en API Route (Next.js 13+)
// ============================================
/*
// app/api/miembros/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const miembros = await db.collection('miembros').find({}).toArray()
    
    return NextResponse.json({
      success: true,
      data: miembros
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener miembros' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('gym_ch_club')
    
    const result = await db.collection('miembros').insertOne({
      ...body,
      fechaCreacion: new Date()
    })
    
    return NextResponse.json({
      success: true,
      id: result.insertedId
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear miembro' },
      { status: 500 }
    )
  }
}
*/

// ============================================
// EJEMPLO 9: Uso en Server Component
// ============================================
/*
// app/miembros/page.tsx
import clientPromise from '@/lib/mongodb'

export default async function MiembrosPage() {
  const client = await clientPromise
  const db = client.db('gym_ch_club')
  const miembros = await db.collection('miembros').find({}).limit(10).toArray()
  
  return (
    <div>
      <h1>Miembros del Gimnasio</h1>
      <ul>
        {miembros.map((miembro: any) => (
          <li key={miembro._id.toString()}>
            {miembro.nombre} - {miembro.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
*/
