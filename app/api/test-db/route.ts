import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// GET /api/test-db - Probar conexión a MongoDB
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('gym_ch_club') // Nombre de tu base de datos
    
    // Ping para verificar conexión
    await db.command({ ping: 1 })
    
    // Ejemplo: obtener todas las colecciones
    const collections = await db.listCollections().toArray()
    
    return NextResponse.json({
      success: true,
      message: 'Conectado a MongoDB Atlas exitosamente',
      database: 'gym_ch_club',
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al conectar a la base de datos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
