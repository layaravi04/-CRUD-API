interface Item {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
  priority: string
  createdAt: string
  updatedAt: string
}

class ItemsStore {
  private items: Item[] = [
    {
      id: "1",
      title: "Learn React Hooks",
      description: "Master useState, useEffect, and custom hooks",
      category: "Learning",
      completed: false,
      priority: "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Build CRUD API",
      description: "Create a REST API with proper conventions",
      category: "Development",
      completed: true,
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  getAllItems(): Item[] {
    return [...this.items]
  }

  getItemById(id: string): Item | undefined {
    return this.items.find((item) => item.id === id)
  }

  addItem(itemData: Omit<Item, "id" | "createdAt" | "updatedAt">): Item {
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.items.push(newItem)
    return newItem
  }

  updateItem(id: string, updates: Partial<Omit<Item, "id" | "createdAt">>): Item | null {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex === -1) return null

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.items[itemIndex]
  }

  deleteItem(id: string): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === id)
    if (itemIndex === -1) return false

    this.items.splice(itemIndex, 1)
    return true
  }
}

const itemsStore = new ItemsStore()
export default itemsStore
export type { Item }
