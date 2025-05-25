import { type NextRequest, NextResponse } from "next/server"
import itemsStore from "@/lib/items-store"

export async function GET() {
  try {
    const items = itemsStore.getAllItems()
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category = "General", completed = false, priority = "medium" } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 })
    }

    const newItem = itemsStore.addItem({
      title: title.trim(),
      description: description.trim(),
      category,
      completed: Boolean(completed),
      priority,
    })

    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 })
  }
}
