import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { sendOrderNotification } from '@/lib/email'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const ordersFile = path.join(dataDir, 'orders.json')

function generateOrderId() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `ORD-${timestamp}-${random}`
}

// POST - Create new order
export async function POST(request) {
  try {
    const body = await request.json()
    const { items, customer } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create order object
    const order = {
      orderId: generateOrderId(),
      items: items.map(item => ({
        documentId: item.documentId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode,
        country: customer.country,
      },
      note: customer.note || '',
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Read existing orders
    let orders = []
    try {
      const fileData = await readFile(ordersFile, 'utf8')
      const data = JSON.parse(fileData)
      orders = data.orders || []
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      orders = []
    }

    // Add new order
    orders.push(order)

    // Write orders back to file
    await writeFile(ordersFile, JSON.stringify({ orders }, null, 2), 'utf8')

    // Send email notification (non-blocking, won't fail if email is not configured)
    sendOrderNotification(order).catch(error => {
      console.error('Email notification failed (order still saved):', error)
    })

    return NextResponse.json(
      { 
        success: true, 
        orderId: order.orderId,
        message: 'Order placed successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}

// GET - Fetch orders (admin only - protected by middleware)
export async function GET() {
  try {
    const fileData = await readFile(ordersFile, 'utf8')
    const { orders } = JSON.parse(fileData)
    
    // Return orders in reverse chronological order (newest first)
    return NextResponse.json({
      data: (orders || []).reverse(),
      meta: {
        total: orders?.length || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

