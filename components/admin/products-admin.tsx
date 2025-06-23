"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { productService, categoryService, type Product, type Category } from "@/lib/api"

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([productService.getAll(), categoryService.getAll()])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData: Omit<Product, "id"> = {
        name: formData.name,
        description: formData.description || undefined,
        brand: formData.brand || undefined,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        categoryId: formData.categoryId ? Number.parseInt(formData.categoryId) : undefined,
        imageUrl: formData.imageUrl || undefined,
      }

      if (editingProduct) {
        const updated = await productService.update(editingProduct.id!, productData)
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)))
      } else {
        const created = await productService.create(productData)
        setProducts([...products, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || "",
      brand: product.brand || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId?.toString() || "",
      imageUrl: product.imageUrl || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.delete(id)
        setProducts(products.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      brand: "",
      price: "",
      stock: "",
      categoryId: "",
      imageUrl: "",
    })
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const getCategoryName = (categoryId?: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "No Category"
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading products...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">PRODUCTS MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 rounded-full px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD PRODUCT
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700]">{editingProduct ? "EDIT PRODUCT" : "ADD PRODUCT"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-[#FFD700]">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-[#FFD700]/20 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand" className="text-[#FFD700]">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="bg-gray-800 border-[#FFD700]/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-[#FFD700]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-[#FFD700]/20 text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-[#FFD700]">
                    Price (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-gray-800 border-[#FFD700]/20 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="text-[#FFD700]">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="bg-gray-800 border-[#FFD700]/20 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-[#FFD700]">
                    Category
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-[#FFD700]/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-[#FFD700]/20">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id!.toString()} className="text-white">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl" className="text-[#FFD700]">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-gray-800 border-[#FFD700]/20 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                  {editingProduct ? "UPDATE" : "CREATE"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]/60 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-[#FFD700]/20 text-white"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-gray-900 border-[#FFD700]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-[#FFD700]/20"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-[#FFD700]">{product.name}</h3>
                      <p className="text-[#FFD700]/70 text-sm">{product.brand}</p>
                      <p className="text-[#FFD700]/60 text-sm">{getCategoryName(product.categoryId)}</p>
                    </div>
                  </div>
                  {product.description && (
                    <p className="text-[#FFD700]/80 text-sm mt-2 line-clamp-2">{product.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#FFD700]">€{product.price}</div>
                  <div className="text-sm text-[#FFD700]/70">Stock: {product.stock}</div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="text-[#FFD700] border-[#FFD700]/40 hover:bg-[#FFD700]/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-400 border-red-400/40 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/60">No products found</p>
        </div>
      )}
    </div>
  )
}
