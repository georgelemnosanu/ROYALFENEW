"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, MapPin, Phone } from "lucide-react"
import { shippingAddressService, userService, type ShippingAddress, type User } from "@/lib/api"

export default function ShippingAddressAdmin() {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null)
  const [formData, setFormData] = useState({
    recipientName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    userId: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [addressesData, usersData] = await Promise.all([shippingAddressService.getAll(), userService.getAll()])
      setAddresses(addressesData)
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAddresses = addresses.filter(
    (address) =>
      address.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const addressData: Omit<ShippingAddress, "id"> = {
        recipientName: formData.recipientName,
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone || undefined,
        userId: Number.parseInt(formData.userId),
      }

      if (editingAddress) {
        const updated = await shippingAddressService.update(editingAddress.id!, addressData)
        setAddresses(addresses.map((a) => (a.id === editingAddress.id ? updated : a)))
      } else {
        const created = await shippingAddressService.create(addressData)
        setAddresses([...addresses, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving address:", error)
    }
  }

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address)
    setFormData({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
      userId: address.userId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await shippingAddressService.delete(id)
        setAddresses(addresses.filter((a) => a.id !== id))
      } catch (error) {
        console.error("Error deleting address:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      recipientName: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
      userId: "",
    })
    setEditingAddress(null)
    setIsDialogOpen(false)
  }

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.fullName : "Unknown User"
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading addresses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">SHIPPING ADDRESSES</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD ADDRESS
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingAddress ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientName" className="text-[#FFD700]/80">
                    Recipient Name
                  </Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="user" className="text-[#FFD700]/80">
                    User
                  </Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id!.toString()} className="text-[#FFD700]">
                          {user.fullName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="street" className="text-[#FFD700]/80">
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-[#FFD700]/80">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-[#FFD700]/80">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-[#FFD700]/80">
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#FFD700]/80">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingAddress ? "UPDATE" : "CREATE"}
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
          placeholder="Search addresses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Addresses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAddresses.map((address) => (
          <Card key={address.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {address.recipientName}
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">{getUserName(address.userId)}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-[#FFD700]/80 text-sm">
                <div>{address.street}</div>
                <div>
                  {address.city}, {address.postalCode}
                </div>
                <div>{address.country}</div>
                {address.phone && (
                  <div className="flex items-center mt-2">
                    <Phone className="h-3 w-3 mr-2" />
                    {address.phone}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAddresses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No addresses found</p>
        </div>
      )}
    </div>
  )
}
