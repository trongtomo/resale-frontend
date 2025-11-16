import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const ordersFile = path.join(dataDir, 'orders.json')

// PUT - Update order (status, paid status, etc.)
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paid, cancelled } = body

    // Read existing orders
    const fileData = await readFile(ordersFile, 'utf8')
    const { orders } = JSON.parse(fileData)

    // Find order by orderId
    const orderIndex = orders.findIndex(order => order.orderId === id)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order
    const updatedOrder = { ...orders[orderIndex] }
    
    if (status !== undefined) {
      updatedOrder.status = status
    }
    
    if (paid !== undefined) {
      updatedOrder.paid = paid
    }
    
    if (cancelled !== undefined) {
      updatedOrder.cancelled = cancelled
      if (cancelled) {
        updatedOrder.status = 'cancelled'
      }
    }

    // Update orders array
    orders[orderIndex] = updatedOrder

    // Write back to file
    await writeFile(ordersFile, JSON.stringify({ orders }, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE - Delete order
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Read existing orders
    const fileData = await readFile(ordersFile, 'utf8')
    const { orders } = JSON.parse(fileData)

    // Filter out the order to delete
    const filteredOrders = orders.filter(order => order.orderId !== id)

    if (filteredOrders.length === orders.length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Write back to file
    await writeFile(ordersFile, JSON.stringify({ orders: filteredOrders }, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

