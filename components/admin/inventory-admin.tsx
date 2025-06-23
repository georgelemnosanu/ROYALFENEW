"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from "lucide-react"
import { inventoryService, productService, type Inventory, type Product } from "@/lib/api"

export default function InventoryAdmin() {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null)
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [inventoriesData, productsData] = await Promise.all([inventoryService.getAll(), productService.getAll()])
      setInventories(inventoriesData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInventories = inventories.filter((inventory) =>
    getProductName(inventory.productId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const inventoryData: Omit<Inventory, "id"> = {
        productId: Number.parseInt(formData.productId),
        quantity: Number.parseInt(formData.quantity),
      }

      if (editingInventory) {
        const updated = await inventoryService.update(editingInventory.id!, inventoryData)
        setInventories(inventories.map((i) => (i.id === editingInventory.id ? updated : i)))
      } else {
        const created = await inventoryService.create(inventoryData)
        setInventories([...inventories, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving inventory:", error)
    }
  }

  const handleEdit = (inventory: Inventory) => {
    setEditingInventory(inventory)
    setFormData({
      productId: inventory.productId.toString(),
      quantity: inventory.quantity.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inventory record?")) {
      try {
        await inventoryService.delete(id)
        setInventories(inventories.filter((i) => i.id !== id))
      } catch (error) {
        console.error("Error deleting inventory:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ productId: "", quantity: "" })
    setEditingInventory(null)
    setIsDialogOpen(false)
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Unknown Product"
  }

  const getProductPrice = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    return product?.price || 0
  }

  const isLowStock = (quantity: number) => quantity < 10

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading inventory...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">INVENTORY MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD INVENTORY
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingInventory ? "EDIT INVENTORY" : "ADD NEW INVENTORY"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <Label htmlFor="quantity" className="text-[#FFD700]/80">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingInventory ? "UPDATE" : "CREATE"}
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
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventories.map((inventory) => (
          <Card key={inventory.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                {getProductName(inventory.productId)}
                {isLowStock(inventory.quantity) && <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />}
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">€{getProductPrice(inventory.productId)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Stock:</span>
                  <span
                    className={`font-semibold ${isLowStock(inventory.quantity) ? "text-red-500" : "text-[#FFD700]"}`}
                  >
                    {inventory.quantity} units
                  </span>
                </div>
                {isLowStock(inventory.quantity) && (
                  <div className="text-red-500 text-xs flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low Stock Warning
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(inventory)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(inventory.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No inventory records found</p>
        </div>
      )}
    </div>
  )
}
