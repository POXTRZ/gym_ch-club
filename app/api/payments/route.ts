import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { Payment } from '@/lib/types'

// GET /api/payments - Obtener pagos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const filter: any = {}
    if (userId) filter.userId = new ObjectId(userId)
    if (status) filter.status = status
    if (type) filter.type = type

    const payments = await db.collection<Payment>('payments')
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json({
      success: true,
      data: payments,
    })
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener pagos' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Registrar pago
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, amount, method, type, description, membershipId, productIds, processedBy } = body
    
    const client = await clientPromise
    const db = client.db('gym_ch_club')

    const newPayment: Omit<Payment, '_id'> = {
      userId: new ObjectId(userId),
      amount,
      method,
      status: 'COMPLETED',
      type,
      description,
      membershipId: membershipId ? new ObjectId(membershipId) : undefined,
      productIds: productIds?.map((id: string) => new ObjectId(id)),
      processedBy: processedBy ? new ObjectId(processedBy) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Payment>('payments').insertOne(newPayment as Payment)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newPayment },
      message: 'Pago registrado exitosamente',
    })
  } catch (error) {
    console.error('Error al registrar pago:', error)
    return NextResponse.json(
      { success: false, error: 'Error al registrar pago' },
      { status: 500 }
    )
  }
}
