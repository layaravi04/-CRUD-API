import { type NextRequest, NextResponse } from "next/server"
import itemsStore from "@/lib/items-store"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = itemsStore.getItemById(params.id)
    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const existingItem = itemsStore.getItemById(params.id)

    if (!existingItem) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    const updatedItem = itemsStore.updateItem(params.id, body)
    return NextResponse.json({ success: true, data: updatedItem })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingItem = itemsStore.getItemById(params.id)
    if (!existingItem) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    const deleted = itemsStore.deleteItem(params.id)
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { id: params.id, deleted: true } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 })
  }
}
