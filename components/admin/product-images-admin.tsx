"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Search, ImageIcon } from "lucide-react"
import { productImageService, productService, type ProductImage, type Product } from "@/lib/api"

export default function ProductImagesAdmin() {
  const [images, setImages] = useState<ProductImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null)
  const [formData, setFormData] = useState({
    productId: "",
    imageUrl: "",
    altText: "",
    isPrimary: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [imagesData, productsData] = await Promise.all([productImageService.getAll(), productService.getAll()])
      setImages(imagesData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredImages = images.filter(
    (image) =>
      getProductName(image.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.altText && image.altText.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const imageData: Omit<ProductImage, "id"> = {
        productId: Number.parseInt(formData.productId),
        imageUrl: formData.imageUrl,
        altText: formData.altText || undefined,
        isPrimary: formData.isPrimary,
      }

      if (editingImage) {
        const updated = await productImageService.update(editingImage.id!, imageData)
        setImages(images.map((i) => (i.id === editingImage.id ? updated : i)))
      } else {
        const created = await productImageService.create(imageData)
        setImages([...images, created])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving image:", error)
    }
  }

  const handleEdit = (image: ProductImage) => {
    setEditingImage(image)
    setFormData({
      productId: image.productId.toString(),
      imageUrl: image.imageUrl,
      altText: image.altText || "",
      isPrimary: image.isPrimary || false,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await productImageService.delete(id)
        setImages(images.filter((i) => i.id !== id))
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ productId: "", imageUrl: "", altText: "", isPrimary: false })
    setEditingImage(null)
    setIsDialogOpen(false)
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Unknown Product"
  }

  if (loading) {
    return <div className="text-[#FFD700] text-center">Loading product images...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-thin tracking-[0.2em] text-[#FFD700]">PRODUCT IMAGES</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2 text-sm tracking-widest"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD IMAGE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#FFD700]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#FFD700] tracking-widest">
                {editingImage ? "EDIT IMAGE" : "ADD NEW IMAGE"}
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
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imageUrl" className="text-[#FFD700]/80">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div>
                <Label htmlFor="altText" className="text-[#FFD700]/80">
                  Alt Text (Optional)
                </Label>
                <Input
                  id="altText"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="bg-transparent border-[#FFD700]/30 text-[#FFD700]"
                  placeholder="Description of the image"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPrimary: checked as boolean })}
                  className="border-[#FFD700]/30"
                />
                <Label htmlFor="isPrimary" className="text-[#FFD700]/80">
                  Set as primary image
                </Label>
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-2">
                  {editingImage ? "UPDATE" : "CREATE"}
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
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
        />
      </div>

      {/* Images Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="bg-black border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-[#FFD700] text-lg flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                {getProductName(image.productId)}
                {image.isPrimary && (
                  <span className="ml-2 text-xs bg-[#FFD700]/20 text-[#FFD700] px-2 py-1 rounded">PRIMARY</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.altText || "Product image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=200&text=Image+Not+Found"
                  }}
                />
              </div>
              {image.altText && <p className="text-[#FFD700]/80 text-sm">{image.altText}</p>}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(image)}
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(image.id!)}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#FFD700]/70">No images found</p>
        </div>
      )}
    </div>
  )
}
