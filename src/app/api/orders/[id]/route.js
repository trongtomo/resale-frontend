import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  const client = await clientPromise
  const db = client.db('chauchaublingstore')
  const result = await db.collection('orders')
    .findOneAndUpdate({ orderId: id }, { $set: body }, { returnDocument: 'after' })

  if (!result) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ success: true, order: result })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const client = await clientPromise
  const result = await client.db('chauchaublingstore').collection('orders')
    .deleteOne({ orderId: id })

  if (!result.deletedCount)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}