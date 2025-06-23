"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, CreditCard } from "lucide-react"
import {
  paymentTransactionService,
  orderService,
  type PaymentTransaction,
  type Order,
  type PaymentStatus,
} from "@/lib/api"

export default function PaymentTransactionAdmin() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<PaymentTransaction | null>(null)
  const [formData, setFormData] = useState({
    orderId: "",
    amount: "",
    currency: "EUR",
    paymentMethod: "",
    providerReference: "",
    status: "INITIATED" as PaymentStatus,
  })

  const statusOptions: PaymentStatus[] = ["INITIATED", "COMPLETED", "FAILED"]
  const paymentMethods = ["CARD", "PAYPAL", "BANK_TRANSFER", "CASH"]
  const currencies = ["EUR", "RON", "USD"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [transactionsData, ordersData] = await Promise.all([
        paymentTransactionService.getAll(),
        orderService.getAll(),
      ])
      setTransactions(transactionsData)
      setOrders(ordersData.content || ordersData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id?.toString().includes(searchTerm) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.providerReference && transaction.providerReference.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const transactionData: Omit<PaymentTransaction, "id"> = {
        orderId: Number.parseInt(formData.orderId),
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        providerReference: formData.providerReference || undefined,
        status: formData.status,
      }

      if (editingTransaction) {
        const updated = await paymentTransactionService.update(editingTransaction.id!, transactionData)
        setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? updated : t)))
      } else {
        const created = await paymentTransactionService.create(transactionData)
        setTransactions([...transactions, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  const handleEdit = (transaction: PaymentTransaction) => {
    setEditingTransaction(transaction)
    setFormData({
      orderId: transaction.orderId.toString(),
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      paymentMethod: transaction.paymentMethod,
      providerReference: transaction.providerReference || "",
      status: transaction.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await paymentTransactionService.delete(id)
        setTransactions(transactions.filter((t) => t.id !== id))
      } catch (error) {
        console.error("Error deleting transaction:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      orderId: "",
      amount: "",
      currency: "EUR",
      paymentMethod: "",
      providerReference: "",
      status: "INITIATED",
    })
    setEditingTransaction(null)
    setIsDialogOpen(false)
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "INITIATED":
        return "bg-yellow-500/20 text-yellow-500"
      case "COMPLETED":
        return "bg-green-500/20 text-green-500"
      case "FAILED":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading transactions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">PAYMENT TRANSACTIONS</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD TRANSACTION
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingTransaction ? "EDIT TRANSACTION" : "ADD NEW TRANSACTION"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                          Order #{order.id} - €{order.totalPrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-[#FFD700]/80">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency" className="text-[#FFD700]/80">
                    Currency
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency} className="text-[#FFD700]">
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentMethod" className="text-[#FFD700]/80">
                    Payment Method
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method} className="text-[#FFD700]">
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-[#FFD700]/80">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: PaymentStatus) => setFormData({ ...formData, status: value })}
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
                <Label htmlFor="providerReference" className="text-[#FFD700]/80">
                  Provider Reference (Optional)
                </Label>
                <Input
                  id="providerReference"
                  value={formData.providerReference}
                  onChange={(e) => setFormData({ ...formData, providerReference: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  placeholder="External payment provider reference"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingTransaction ? "UPDATE" : "CREATE"}
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
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Transactions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Transaction #{transaction.id}
                </div>
                <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
              </CardTitle>
              <div className="text-[#FFD700]/70 text-sm">Order #{transaction.orderId}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Amount:</span>
                  <span className="text-[#FFD700] font-semibold">
                    {transaction.amount} {transaction.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FFD700]/80">Method:</span>
                  <span className="text-[#FFD700]">{transaction.paymentMethod}</span>
                </div>
                {transaction.providerReference && (
                  <div className="text-[#FFD700]/60 text-xs">Ref: {transaction.providerReference}</div>
                )}
                <div className="text-[#FFD700]/60 text-xs">
                  {transaction.transactionDate && new Date(transaction.transactionDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(transaction)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(transaction.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No transactions found</p>
        </div>
      )}
    </div>
  )
}
