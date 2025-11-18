import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Obtener ventas
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const today = searchParams.get('today')

    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const salesCollection = db.collection('sales')

    let query = {}
    if (today === 'true') {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      query = { createdAt: { $gte: startOfDay, $lte: endOfDay } }
    }

    const sales = await salesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({ success: true, data: sales })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener ventas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva venta
export async function POST(req: NextRequest) {
  try {
    const { employeeId, products, total } = await req.json()

    if (!employeeId || !products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const salesCollection = db.collection('sales')
    const productsCollection = db.collection('products')
    const usersCollection = db.collection('users')

    // Buscar empleado (employeeId puede ser email o ObjectId)
    let employeeObjectId: ObjectId
    if (ObjectId.isValid(employeeId)) {
      employeeObjectId = new ObjectId(employeeId)
    } else {
      const employee = await usersCollection.findOne({ email: employeeId })
      if (!employee) {
        return NextResponse.json(
          { success: false, error: 'Empleado no encontrado' },
          { status: 404 }
        )
      }
      employeeObjectId = employee._id
    }

    // Verificar stock y actualizar inventario
    for (const item of products) {
      const product = await productsCollection.findOne({
        _id: new ObjectId(item.productId),
      })

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Producto ${item.name} no encontrado` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
          },
          { status: 400 }
        )
      }

      // Reducir stock
      await productsCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        { $inc: { stock: -item.quantity } }
      )
    }

    // Crear venta
    const newSale = {
      employeeId: employeeObjectId,
      products: products.map((p: any) => ({
        productId: new ObjectId(p.productId),
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        subtotal: p.price * p.quantity,
      })),
      total,
      createdAt: new Date(),
    }

    const result = await salesCollection.insertOne(newSale)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newSale },
    })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear venta' },
      { status: 500 }
    )
  }
}
