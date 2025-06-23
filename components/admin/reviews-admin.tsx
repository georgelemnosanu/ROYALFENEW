"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star, Plus, Edit, Trash2, Search } from "lucide-react"
import { type Review, type Product, type User, reviewService, productService, userService } from "@/lib/api"

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Review | null>(null)
  const [form, setForm] = useState({ userId: "", productId: "", rating: "5", comment: "" })

  useEffect(() => {
    ;(async () => {
      try {
        const [r, p, u] = await Promise.all([reviewService.getAll(), productService.getAll(), userService.getAll()])
        setReviews(r)
        setProducts(p)
        setUsers(u)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = reviews.filter(
    (r) =>
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      getProduct(r.productId).name.toLowerCase().includes(search.toLowerCase()) ||
      getUser(r.userId).firstName.toLowerCase().includes(search.toLowerCase()),
  )

  function getProduct(id: number) {
    return products.find((p) => p.id === id) ?? { name: "Unknown" }
  }
  function getUser(id: number) {
    return users.find((u) => u.id === id) ?? { firstName: "Unknown", lastName: "" }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const data: Review = {
      userId: Number(form.userId),
      productId: Number(form.productId),
      rating: Number(form.rating),
      comment: form.comment,
    }
    if (editing) {
      const upd = await reviewService.update(editing.id!, data)
      setReviews(reviews.map((r) => (r.id === editing.id ? upd : r)))
    } else {
      const created = await reviewService.create(data)
      setReviews([...reviews, created])
    }
    reset()
  }

  async function remove(id: number) {
    if (confirm("Delete review?")) {
      await reviewService.delete(id)
      setReviews(reviews.filter((r) => r.id !== id))
    }
  }

  function reset() {
    setEditing(null)
    setForm({ userId: "", productId: "", rating: "5", comment: "" })
    setDialogOpen(false)
  }

  if (loading) return <p className="text-[#FFD700] text-center">Loading reviews…</p>

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">REVIEWS MANAGEMENT</h2>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={reset} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 px-6 py-2">
              <Plus className="w-4 h-4 mr-2" />
              ADD REVIEW
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editing ? "EDIT REVIEW" : "ADD REVIEW"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label className="text-[#FFD700]/80">User</Label>
                <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v })}>
                  <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    {users.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)} className="text-[#FFD700]">
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#FFD700]/80">Product</Label>
                <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                  <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#FFD700]/30">
                    {products.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)} className="text-[#FFD700]">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#FFD700]/80">Rating</Label>
                  <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
                    <SelectTrigger className="bg-transparent border-[#FFD700]/30 text-[#FFD700]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#FFD700]/30">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)} className="text-[#FFD700]">
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#FFD700]/80"> </Label>
                  <Star className="mt-[38px] h-5 w-5 text-[#FFD700]" />
                </div>
              </div>

              <div>
                <Label className="text-[#FFD700]/80">Comment</Label>
                <Textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700] min-h-[120px]"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 px-6">
                  {editing ? "UPDATE" : "CREATE"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  CANCEL
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFD700]/50" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r) => (
          <Card key={r.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] flex items-center gap-2">
                <Star className="h-4 w-4 fill-current text-[#FFD700]" />
                {r.rating} &nbsp; – {getProduct(r.productId).name}
              </CardTitle>
              <p className="text-[#FFD700]/60 text-sm">{getUser(r.userId).firstName}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[#FFD700]/80 text-sm line-clamp-4">{r.comment}</p>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(r)
                    setForm({
                      userId: String(r.userId),
                      productId: String(r.productId),
                      rating: String(r.rating),
                      comment: r.comment ?? "",
                    })
                    setDialogOpen(true)
                  }}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(r.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center py-12 text-[#FFD700]/70">No reviews found</p>}
    </div>
  )
}
