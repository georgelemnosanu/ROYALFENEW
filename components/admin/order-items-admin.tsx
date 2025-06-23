"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { type OrderItem, type Order, type Product, orderItemService, orderService, productService } from "@/lib/api"

export default function OrderItemsAdmin() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null)
  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    quantity: "",
    price: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [itemsData, ordersData, productsData] = await Promise.all([
        orderItemService.getAll(),
        orderService.getAll(),
        productService.getAll(),
      ])
      setOrderItems(itemsData)
      setOrders(ordersData.content || ordersData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = orderItems.filter(
    (item) =>
      item.id?.toString().includes(searchTerm) ||
      getProductName(item.productId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const itemData = {
        orderId: Number.parseInt(formData.orderId),
        productId: Number.parseInt(formData.productId),
        quantity: Number.parseInt(formData.quantity),
        price: Number.parseFloat(formData.price),
      }

      if (editingItem) {
        const updated = await orderItemService.update(editingItem.id!, itemData)
        setOrderItems(orderItems.map((i) => (i.id === editingItem.id ? updated : i)))
      } else {
        const created = await orderItemService.create(itemData)
        setOrderItems([...orderItems, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving order item:", error)
    }
  }

  const handleEdit = (item: OrderItem) => {
    setEditingItem(item)
    setFormData({
      orderId: item.orderId.toString(),
      productId: item.productId.toString(),
      quantity: item.quantity.toString(),
      price: item.price.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this order item?")) {
      try {
        await orderItemService.delete(id)
        setOrderItems(orderItems.filter((i) => i.id !== id))
      } catch (error) {
        console.error("Error deleting order item:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ orderId: "", productId: "", quantity: "", price: "" })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Unknown Product"
  }

  const getOrderNumber = (orderId: number) => {
    return `Order #${orderId}`
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading order items...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">ORDER ITEMS MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD ORDER ITEM
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingItem ? "EDIT ORDER ITEM" : "ADD NEW ORDER ITEM"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="order" className="text-[#FFD700]/80">
                  Order
                </Label>
                <Select
                  value={formData.orderId}
                  onValueChange={(value) => setFormData({ ...formData, orderId: value })}
                >
                  <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id!.toString()} className="text-[#FFD700]">
                        Order #{order.id} - €{order.totalAmount}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-[#FFD700]/80">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-[#FFD700]/80">
                    Price (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
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
          placeholder="Search order items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Order Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg">{getProductName(item.productId)}</CardTitle>
              <div className="text-[#FFD700]/70 text-sm">{getOrderNumber(item.orderId)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Quantity:</span>
                  <span className="text-[#FFD700]">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Unit Price:</span>
                  <span className="text-[#FFD700]">€{item.price}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-[#FFD700]/80">Total:</span>
                  <span className="text-[#FFD700]">€{(item.quantity * item.price).toFixed(2)}</span>
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
          <p className="text-[#FFD700]/70">No order items found</p>
        </div>
      )}
    </div>
  )
}
