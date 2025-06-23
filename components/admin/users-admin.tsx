"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Search, Mail, Phone } from "lucide-react"
import { userService, type User as ApiUser } from "@/lib/api"

export default function UsersAdmin() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    password: "",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await userService.getAll()
      setUsers(data)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userData: Omit<ApiUser, "id"> = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        password: formData.password,
      }

      if (editingUser) {
        const updated = await userService.update(editingUser.id!, userData)
        setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)))
      } else {
        const created = await userService.create(userData)
        setUsers([...users, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleEdit = (user: ApiUser) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || "",
      password: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id)
        setUsers(users.filter((u) => u.id !== id))
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ username: "", email: "", fullName: "", phone: "", password: "" })
    setEditingUser(null)
    setIsDialogOpen(false)
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">USERS MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD USER
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingUser ? "EDIT USER" : "ADD NEW USER"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" className="text-[#FFD700]/80">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fullName" className="text-[#FFD700]/80">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-[#FFD700]/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="password" className="text-[#FFD700]/80">
                    Password {editingUser && "(leave empty to keep current)"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required={!editingUser}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingUser ? "UPDATE" : "CREATE"}
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
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                {user.fullName}
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">@{user.username}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-[#FFD700]/80 text-sm">
                  <Mail className="h-3 w-3 mr-2" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center text-[#FFD700]/80 text-sm">
                    <Phone className="h-3 w-3 mr-2" />
                    {user.phone}
                  </div>
                )}
                <div className="text-[#FFD700]/60 text-xs">Status: {user.enabled ? "Active" : "Disabled"}</div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(user)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No users found</p>
        </div>
      )}
    </div>
  )
}
