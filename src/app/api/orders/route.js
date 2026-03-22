import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { sendOrderNotification } from '@/lib/email'

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, customer } = body

    if (!items?.length)
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    if (!customer?.fullName || !customer?.email || !customer?.phone || !customer?.address)
      return NextResponse.json({ error: 'Missing customer info' }, { status: 400 })

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
      orderId: generateOrderId(),
      items: items.map(({ _id, name, price, quantity }) =>
        ({ productId: _id, name, price, quantity })),
      customer,
      note: customer.note || '',
      total,
      status: 'pending',
      createdAt: new Date(),
    }

    const client = await clientPromise
    const db = await (async function getDb() {
      const client = await clientPromise
      return client.db('chauchaublingstore')
    })()
    await db.collection('orders').insertOne(order)
    sendOrderNotification(order).catch(console.error)

    return NextResponse.json({ success: true, orderId: order.orderId }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const orders = await client.db('chauchaublingstore-database').collection('orders')
      .find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ data: orders, meta: { total: orders.length } })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}