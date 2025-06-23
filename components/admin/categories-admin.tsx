"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { type Category, categoryService } from "@/lib/api"

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
      }

      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id!, categoryData)
        setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)))
      } else {
        const created = await categoryService.create(categoryData)
        setCategories([...categories, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryService.delete(id)
        setCategories(categories.filter((c) => c.id !== id))
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading categories...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">CATEGORIES MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD CATEGORY
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingCategory ? "EDIT CATEGORY" : "ADD NEW CATEGORY"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#FFD700]/80">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  maxLength={60}
                  required
                />
                <p className="text-xs text-[#FFD700]/50 mt-1">Max 60 characters</p>
              </div>
              <div>
                <Label htmlFor="description" className="text-[#FFD700]/80">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingCategory ? "UPDATE" : "CREATE"}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  CANCEL
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]/50 h-4 w-4" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#FFD700]/80 text-sm">{category.description || "No description"}</p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No categories found</p>
          <p className="text-[#FFD700]/50 text-sm mt-2">Create your first category to get started</p>
        </div>
      )}
    </div>
  )
}
