import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Product } from '@/lib/types'

// GET /api/products - Obtener todos los productos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lowStock = searchParams.get('lowStock')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const filter: any = { isActive: true }
    if (category) filter.category = category
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$stock', '$minStock'] }
    }

    const products = await db.collection<Product>('products')
      .find(filter)
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const newProduct: Omit<Product, '_id'> = {
      ...body,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Product>('products').insertOne(newProduct as Product)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newProduct },
      message: 'Producto creado exitosamente',
    })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}

// PUT /api/products - Actualizar producto
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { _id, ...updates } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const result = await db.collection<Product>('products').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updates, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}
