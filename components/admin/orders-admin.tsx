"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Eye, Package } from "lucide-react"
import {
  orderService,
  userService,
  shippingAddressService,
  type Order,
  type User,
  type ShippingAddress,
  type OrderStatus,
} from "@/lib/api"

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState({
    userId: "",
    totalPrice: "",
    status: "PENDING" as OrderStatus,
    shippingAddressId: "",
  })

  const statusOptions: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ordersData, usersData, addressesData] = await Promise.all([
        orderService.getAll(),
        userService.getAll(),
        shippingAddressService.getAll(),
      ])
      setOrders(ordersData.content || ordersData)
      setUsers(usersData)
      setAddresses(addressesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.id?.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(order.userId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const orderData: Omit<Order, "id"> = {
        userId: formData.userId ? Number.parseInt(formData.userId) : undefined,
        totalPrice: Number.parseFloat(formData.totalPrice),
        status: formData.status,
        shippingAddressId: Number.parseInt(formData.shippingAddressId),
      }

      if (editingOrder) {
        const updated = await orderService.update(editingOrder.id!, orderData)
        setOrders(orders.map((o) => (o.id === editingOrder.id ? updated : o)))
      } else {
        const created = await orderService.create(orderData)
        setOrders([...orders, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving order:", error)
    }
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setFormData({
      userId: order.userId?.toString() || "",
      totalPrice: order.totalPrice.toString(),
      status: order.status,
      shippingAddressId: order.shippingAddressId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await orderService.delete(id)
        setOrders(orders.filter((o) => o.id !== id))
      } catch (error) {
        console.error("Error deleting order:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ userId: "", totalPrice: "", status: "PENDING", shippingAddressId: "" })
    setEditingOrder(null)
    setIsDialogOpen(false)
  }

  const getUserName = (userId?: number) => {
    if (!userId) return "Guest"
    const user = users.find((u) => u.id === userId)
    return user ? user.fullName : "Unknown User"
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-500"
      case "PAID":
        return "bg-blue-500/20 text-blue-500"
      case "SHIPPED":
        return "bg-purple-500/20 text-purple-500"
      case "DELIVERED":
        return "bg-green-500/20 text-green-500"
      case "CANCELLED":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading orders...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">ORDERS MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD ORDER
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingOrder ? "EDIT ORDER" : "ADD NEW ORDER"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user" className="text-[#FFD700]/80">
                    User
                  </Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue placeholder="Select user (optional for guest)" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      <SelectItem value="" className="text-[#FFD700]">
                        Guest Order
                      </SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id!.toString()} className="text-[#FFD700]">
                          {user.fullName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="totalPrice" className="text-[#FFD700]/80">
                    Total Price (€)
                  </Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-[#FFD700]/80">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="text-[#FFD700]">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shippingAddress" className="text-[#FFD700]/80">
                    Shipping Address
                  </Label>
                  <Select
                    value={formData.shippingAddressId}
                    onValueChange={(value) => setFormData({ ...formData, shippingAddressId: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id!.toString()} className="text-[#FFD700]">
                          {address.recipientName} - {address.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingOrder ? "UPDATE" : "CREATE"}
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
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Orders Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order #{order.id}
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">{getUserName(order.userId)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#FFD700]/80">Total:</span>
                <span className="text-[#FFD700] font-semibold">€{order.totalPrice}</span>
              </div>
              <div className="text-[#FFD700]/60 text-xs">
                {order.createdAt && new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(order)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(order.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No orders found</p>
        </div>
      )}
    </div>
  )
}
