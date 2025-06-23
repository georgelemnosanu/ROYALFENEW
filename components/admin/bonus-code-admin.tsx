"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Gift, Percent } from "lucide-react"
import { bonusCodeService, type BonusCode, type DiscountType, type BonusCodeStatus } from "@/lib/api"

export default function BonusCodeAdmin() {
  const [bonusCodes, setBonusCodes] = useState<BonusCode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<BonusCode | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as DiscountType,
    discountValue: "",
    validFrom: "",
    validTo: "",
    usageLimit: "",
    minOrderValue: "",
    status: "ACTIVE" as BonusCodeStatus,
  })

  const discountTypes: DiscountType[] = ["PERCENTAGE", "FIXED"]
  const statusOptions: BonusCodeStatus[] = ["ACTIVE", "EXPIRED", "USED_UP"]

  useEffect(() => {
    loadBonusCodes()
  }, [])

  const loadBonusCodes = async () => {
    try {
      const data = await bonusCodeService.getAll()
      setBonusCodes(data)
    } catch (error) {
      console.error("Error loading bonus codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCodes = bonusCodes.filter(
    (code) =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const codeData: Omit<BonusCode, "id"> = {
        code: formData.code,
        description: formData.description || undefined,
        discountType: formData.discountType,
        discountValue: Number.parseFloat(formData.discountValue),
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        usageLimit: formData.usageLimit ? Number.parseInt(formData.usageLimit) : undefined,
        timesUsed: 0,
        minOrderValue: formData.minOrderValue ? Number.parseFloat(formData.minOrderValue) : undefined,
        status: formData.status,
      }

      if (editingCode) {
        const updated = await bonusCodeService.update(editingCode.id!, codeData)
        setBonusCodes(bonusCodes.map((c) => (c.id === editingCode.id ? updated : c)))
      } else {
        const created = await bonusCodeService.create(codeData)
        setBonusCodes([...bonusCodes, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving bonus code:", error)
    }
  }

  const handleEdit = (code: BonusCode) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      description: code.description || "",
      discountType: code.discountType,
      discountValue: code.discountValue.toString(),
      validFrom: code.validFrom.split("T")[0], // Convert to date input format
      validTo: code.validTo.split("T")[0],
      usageLimit: code.usageLimit?.toString() || "",
      minOrderValue: code.minOrderValue?.toString() || "",
      status: code.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this bonus code?")) {
      try {
        await bonusCodeService.delete(id)
        setBonusCodes(bonusCodes.filter((c) => c.id !== id))
      } catch (error) {
        console.error("Error deleting bonus code:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      validFrom: "",
      validTo: "",
      usageLimit: "",
      minOrderValue: "",
      status: "ACTIVE",
    })
    setEditingCode(null)
    setIsDialogOpen(false)
  }

  const getStatusColor = (status: BonusCodeStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/20 text-green-500"
      case "EXPIRED":
        return "bg-yellow-500/20 text-yellow-500"
      case "USED_UP":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const formatDiscount = (type: DiscountType, value: number) => {
    return type === "PERCENTAGE" ? `${value}%` : `€${value}`
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading bonus codes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">BONUS CODES MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD BONUS CODE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingCode ? "EDIT BONUS CODE" : "ADD NEW BONUS CODE"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" className="text-[#FFD700]/80">
                    Code
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    placeholder="SAVE20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-[#FFD700]/80">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: BonusCodeStatus) => setFormData({ ...formData, status: value })}
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
                  placeholder="20% discount on all products"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType" className="text-[#FFD700]/80">
                    Discount Type
                  </Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: DiscountType) => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {discountTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-[#FFD700]">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue" className="text-[#FFD700]/80">
                    Discount Value {formData.discountType === "PERCENTAGE" ? "(%)" : "(€)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom" className="text-[#FFD700]/80">
                    Valid From
                  </Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validTo" className="text-[#FFD700]/80">
                    Valid To
                  </Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usageLimit" className="text-[#FFD700]/80">
                    Usage Limit (Optional)
                  </Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="minOrderValue" className="text-[#FFD700]/80">
                    Min Order Value (€)
                  </Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    step="0.01"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    placeholder="50.00"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingCode ? "UPDATE" : "CREATE"}
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
          placeholder="Search bonus codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Bonus Codes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCodes.map((code) => (
          <Card key={code.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  {code.code}
                </div>
                <Badge className={getStatusColor(code.status)}>{code.status}</Badge>
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm flex items-center">
                <Percent className="h-3 w-3 mr-1" />
                {formatDiscount(code.discountType, code.discountValue)} discount
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {code.description && <p className="text-[#FFD700]/80 text-sm">{code.description}</p>}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Valid:</span>
                  <span className="text-[#FFD700]">
                    {new Date(code.validFrom).toLocaleDateString()} - {new Date(code.validTo).toLocaleDateString()}
                  </span>
                </div>
                {code.usageLimit && (
                  <div className="flex justify-between">
                    <span className="text-[#FFD700]/80">Usage:</span>
                    <span className="text-[#FFD700]">
                      {code.timesUsed}/{code.usageLimit}
                    </span>
                  </div>
                )}
                {code.minOrderValue && (
                  <div className="flex justify-between">
                    <span className="text-[#FFD700]/80">Min Order:</span>
                    <span className="text-[#FFD700]">€{code.minOrderValue}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(code)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(code.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No bonus codes found</p>
        </div>
      )}
    </div>
  )
}
