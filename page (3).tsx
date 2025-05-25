"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Star,
  CheckCircle,
  Circle,
  BookOpen,
  Code,
  Cherry,
  AlertTriangle,
  Clock,
  Zap,
} from "lucide-react"

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

export default function CrudApiPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [items, setItems] = useState<Item[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    completed: false,
    priority: "medium",
  })

  const categories = ["General", "Learning", "Development", "Design", "Personal", "Work"]
  const priorities = ["low", "medium", "high"]

  const fetchItems = async () => {
    try {
      const response = await fetch("/items")
      const data = await response.json()
      if (data.success) {
        setItems(data.data)
      } else {
        setMessage("Failed to load items")
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const url = editingItem ? `/items/${editingItem.id}` : "/items"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(editingItem ? "Item updated successfully!" : "Item created successfully!")
        setFormData({ title: "", description: "", category: "General", completed: false, priority: "medium" })
        setEditingItem(null)
        setIsDialogOpen(false)
        fetchItems()
      } else {
        setMessage(data.error || "Operation failed")
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      completed: item.completed,
      priority: item.priority,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/items/${id}`, { method: "DELETE" })
      const data = await response.json()

      if (data.success) {
        setMessage("Item deleted successfully!")
        fetchItems()
      } else {
        setMessage(data.error || "Delete failed")
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleComplete = async (item: Item) => {
    try {
      const response = await fetch(`/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !item.completed }),
      })

      const data = await response.json()
      if (data.success) {
        fetchItems()
      }
    } catch (error) {
      console.error("Toggle complete error:", error)
    }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "General", completed: false, priority: "medium" })
    setEditingItem(null)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Learning":
        return <BookOpen className="w-4 h-4" />
      case "Development":
        return <Code className="w-4 h-4" />
      case "Design":
        return <Cherry className="w-4 h-4" />
      case "Personal":
        return <Heart className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "low":
        return <Zap className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Learning":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Development":
        return "bg-green-100 text-green-700 border-green-200"
      case "Design":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Personal":
        return "bg-pink-100 text-pink-700 border-pink-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-20 left-20 text-pink-300 w-8 h-8 animate-pulse" />
        <Sparkles className="absolute top-32 right-32 text-red-300 w-6 h-6 animate-bounce" />
        <Star className="absolute bottom-32 left-32 text-pink-400 w-7 h-7 animate-pulse" />
        <Plus className="absolute bottom-20 right-20 text-red-400 w-8 h-8 animate-bounce" />
        <Cherry className="absolute top-1/2 left-10 text-pink-500 w-6 h-6 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <Cherry className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Cherry CRUD API
          </h1>
          <p className="text-red-600 mt-2 font-medium">Complete REST API with proper conventions & error handling</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{items.length}</div>
              <div className="text-sm text-pink-500">Total Items</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{items.filter((i) => i.completed).length}</div>
              <div className="text-sm text-green-500">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{items.filter((i) => !i.completed).length}</div>
              <div className="text-sm text-red-500">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{new Set(items.map((i) => i.category)).size}</div>
              <div className="text-sm text-purple-500">Categories</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-700">Manage Items</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-pink-200 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-pink-700">{editingItem ? "Edit Item" : "Create New Item"}</DialogTitle>
                <DialogDescription className="text-pink-600">
                  {editingItem ? "Update your item details below." : "Add a new item to your collection."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-pink-700">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter item title"
                    required
                    className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-pink-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter item description"
                    required
                    className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-pink-700">
                      Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="border-pink-200 focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(category)}
                              {category}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-pink-700">
                      Priority
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger className="border-pink-200 focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            <div className="flex items-center gap-2 capitalize">
                              {getPriorityIcon(priority)}
                              {priority}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="completed"
                    checked={formData.completed}
                    onCheckedChange={(checked) => setFormData({ ...formData, completed: Boolean(checked) })}
                    className="border-pink-300 data-[state=checked]:bg-pink-500"
                  />
                  <Label htmlFor="completed" className="text-pink-700">
                    Mark as completed
                  </Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                  >
                    {isLoading ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {isLoading && items.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-pink-600 font-medium">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="border-2 border-pink-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-pink-700 mb-2">No items yet!</h3>
              <p className="text-pink-600 mb-4">Create your first item to get started.</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="border-2 border-pink-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle
                        className={`text-lg ${item.completed ? "line-through text-gray-500" : "text-pink-700"}`}
                      >
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge className={`${getCategoryColor(item.category)} border`}>
                          {getCategoryIcon(item.category)}
                          <span className="ml-1">{item.category}</span>
                        </Badge>
                        <Badge className={`${getPriorityColor(item.priority)} border`}>
                          {getPriorityIcon(item.priority)}
                          <span className="ml-1 capitalize">{item.priority}</span>
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComplete(item)}
                          className="p-1 h-auto text-pink-600 hover:text-pink-700"
                        >
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={`text-sm mb-4 ${item.completed ? "line-through text-gray-500" : "text-pink-600"}`}>
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-pink-500">
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12 text-pink-600">
          <p className="text-sm">Cherry CRUD API</p>
        </div>
      </div>
    </div>
  )
}
