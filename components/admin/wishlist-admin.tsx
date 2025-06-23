"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search, Heart } from "lucide-react"
import { type Wishlist, type User, type Product, wishlistService, userService, productService } from "@/lib/api"

export default function WishlistAdmin() {
  const [wishlistItems, setWishlistItems] = useState<Wishlist[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Wishlist | null>(null)
  const [formData, setFormData] = useState({
    userId: "",
    productId: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [itemsData, usersData, productsData] = await Promise.all([
        wishlistService.getAll(),
        userService.getAll(),
        productService.getAll(),
      ])
      setWishlistItems(itemsData)
      setUsers(usersData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = wishlistItems.filter(
    (item) =>
      getUserName(item.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(item.productId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const itemData = {
        userId: Number.parseInt(formData.userId),
        productId: Number.parseInt(formData.productId),
      }

      if (editingItem) {
        const updated = await wishlistService.update(editingItem.id!, itemData)
        setWishlistItems(wishlistItems.map((i) => (i.id === editingItem.id ? updated : i)))
      } else {
        const created = await wishlistService.create(itemData)
        setWishlistItems([...wishlistItems, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving wishlist item:", error)
    }
  }

  const handleEdit = (item: Wishlist) => {
    setEditingItem(item)
    setFormData({
      userId: item.userId.toString(),
      productId: item.productId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this wishlist item?")) {
      try {
        await wishlistService.delete(id)
        setWishlistItems(wishlistItems.filter((i) => i.id !== id))
      } catch (error) {
        console.error("Error deleting wishlist item:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ userId: "", productId: "" })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User"
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Unknown Product"
  }

  const getProductPrice = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    return product?.price || 0
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading wishlist items...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">WISHLIST MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD WISHLIST ITEM
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingItem ? "EDIT WISHLIST ITEM" : "ADD NEW WISHLIST ITEM"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="user" className="text-[#FFD700]/80">
                  User
                </Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                  <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id!.toString()} className="text-[#FFD700]">
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="product" className="text-[#FFD700]/80">
                  Product
                </Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                >
                  <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id!.toString()} className="text-[#FFD700]">
                        {product.name} - €{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingItem ? "UPDATE" : "CREATE"}
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
          placeholder="Search wishlist items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500 fill-current" />
                {getProductName(item.productId)}
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">{getUserName(item.userId)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Price:</span>
                  <span className="text-[#FFD700]">€{getProductPrice(item.productId)}</span>
                </div>
                <div className="text-[#FFD700]/60 text-xs">
                  Added: {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No wishlist items found</p>
        </div>
      )}
    </div>
  )
}
