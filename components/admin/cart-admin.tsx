"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search, ShoppingCart } from "lucide-react"
import { type Cart, type User, cartService, userService } from "@/lib/api"

export default function CartAdmin() {
  const [carts, setCarts] = useState<Cart[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCart, setEditingCart] = useState<Cart | null>(null)
  const [formData, setFormData] = useState({
    userId: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const usersData = await userService.getAll()
      setUsers(usersData)

      // Mock carts data since we don't have a getAll method for carts
      const mockCarts: Cart[] = [
        { id: 1, userId: 1, createdAt: "2024-01-01T10:00:00Z", updatedAt: "2024-01-01T10:00:00Z" },
        { id: 2, userId: 2, createdAt: "2024-01-02T10:00:00Z", updatedAt: "2024-01-02T10:00:00Z" },
      ]
      setCarts(mockCarts)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCarts = carts.filter(
    (cart) =>
      cart.id?.toString().includes(searchTerm) ||
      getUserName(cart.userId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const cartData = {
        userId: Number.parseInt(formData.userId),
      }

      if (editingCart) {
        const updated = await cartService.update(editingCart.id!, cartData)
        setCarts(carts.map((c) => (c.id === editingCart.id ? updated : c)))
      } else {
        const created = await cartService.create(cartData)
        setCarts([...carts, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  const handleEdit = (cart: Cart) => {
    setEditingCart(cart)
    setFormData({
      userId: cart.userId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this cart?")) {
      try {
        await cartService.delete(id)
        setCarts(carts.filter((c) => c.id !== id))
      } catch (error) {
        console.error("Error deleting cart:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ userId: "" })
    setEditingCart(null)
    setIsDialogOpen(false)
  }

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User"
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading carts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">SHOPPING CARTS MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD CART
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingCart ? "EDIT CART" : "ADD NEW CART"}
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
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingCart ? "UPDATE" : "CREATE"}
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
          placeholder="Search carts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Carts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCarts.map((cart) => (
          <Card key={cart.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart #{cart.id}
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">{getUserName(cart.userId)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-[#FFD700]/60 text-xs">
                  Created: {cart.createdAt && new Date(cart.createdAt).toLocaleDateString()}
                </div>
                <div className="text-[#FFD700]/60 text-xs">
                  Updated: {cart.updatedAt && new Date(cart.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(cart)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cart.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCarts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No carts found</p>
        </div>
      )}
    </div>
  )
}
