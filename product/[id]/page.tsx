"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, ShoppingCart, Star, Menu, X } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
}

interface Review {
  id: number
  rating: number
  comment: string
  user?: {
    firstName: string
    lastName: string
  }
  createdAt?: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: PageProps) {
  // Unwrap params using React.use()
  const { id } = use(params)

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      // Use the backend API instead of Next.js API routes
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

      const [productRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products/${id}`),
        fetch(`${API_BASE_URL}/reviews/product/${id}`),
      ])

      if (productRes.ok) {
        const productData = await productRes.json()
        setProduct(productData)
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData)
      }
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product?.id || !newReview.comment.trim()) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: newReview.rating,
          comment: newReview.comment,
          userId: 1, // Mock user ID
        }),
      })

      if (response.ok) {
        const review = await response.json()
        setReviews([review, ...reviews])
        setNewReview({ rating: 5, comment: "" })
        setShowReviewForm(false)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <Star className={`h-4 w-4 ${star <= rating ? "text-[#FFD700] fill-current" : "text-[#FFD700]/30"}`} />
          </button>
        ))}
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-[#FFD700] text-xl tracking-widest">SE ÎNCARCĂ...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-[#FFD700] mb-4">PRODUSUL NU A FOST GĂSIT</h1>
          <Link href="/catalog">
            <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black">ÎNAPOI LA COLECȚIE</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#FFD700]/20">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z" />
                </svg>
                <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#FFD700]/30 rounded-full blur-lg"></div>
              </div>
              <div className="text-sm sm:text-xl font-light tracking-[0.2em] text-[#FFD700]">
                ROYAL ESSENCE
                <span className="block text-xs font-thin tracking-[0.3em] text-[#FFD700]/80">LUXURY</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              <Link
                href="/"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                ACASĂ
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#FFD700] transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                href="/catalog"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                COLECȚIE
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#FFD700] transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                href="/story"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                POVESTE
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#FFD700] transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                href="/contact"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                CONTACT
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#FFD700] transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FFD700] hover:bg-[#FFD700]/10 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <Heart className="h-3 w-3 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-none px-2 sm:px-4 py-1 sm:py-2 text-xs tracking-[0.2em]"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">COȘ</span>
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#FFD700] hover:bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/40 w-8 h-8 sm:w-10 sm:h-10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-[#FFD700]/20">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="text-[#FFD700]/80 hover:text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ACASĂ
                </Link>
                <Link
                  href="/catalog"
                  className="text-[#FFD700]/80 hover:text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  COLECȚIE
                </Link>
                <Link
                  href="/story"
                  className="text-[#FFD700]/80 hover:text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  POVESTE
                </Link>
                <Link
                  href="/contact"
                  className="text-[#FFD700]/80 hover:text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CONTACT
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Product Detail */}
      <section className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            href="/catalog"
            className="inline-flex items-center text-[#FFD700]/70 hover:text-[#FFD700] mb-8 sm:mb-12 text-sm tracking-widest"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ÎNAPOI LA COLECȚIE
          </Link>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt={product.name}
                width={600}
                height={800}
                className="w-full object-cover"
              />
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-thin tracking-[0.2em] text-[#FFD700] mb-3 sm:mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-3 sm:mb-4">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-[#FFD700]/70 text-sm">
                    ({reviews.length} recenzi{reviews.length !== 1 ? "i" : "e"})
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-light text-[#FFD700] mb-4 sm:mb-6">€{product.price}</div>
              </div>

              <div className="inline-block border-t border-[#FFD700]/30 w-16 sm:w-24"></div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base text-[#FFD700]/80 leading-relaxed tracking-wider">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8">
                <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-8 sm:px-12 py-4 sm:py-6 text-sm tracking-widest flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  ADAUGĂ ÎN COȘ
                </Button>
                <Button
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] px-4 sm:px-6 py-4 sm:py-6"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 sm:py-16 bg-black border-t border-[#FFD700]/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-thin tracking-[0.2em] text-[#FFD700] mb-2">RECENZII</h2>
                <div className="flex items-center space-x-4">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-[#FFD700]/70 text-sm">
                    {averageRating.toFixed(1)} din 5 ({reviews.length} recenzi{reviews.length !== 1 ? "i" : "e"})
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] px-4 sm:px-6 py-2 sm:py-3 text-sm tracking-widest"
              >
                SCRIE RECENZIE
              </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-8 sm:mb-12 p-4 sm:p-6 border border-[#FFD700]/20">
                <h3 className="text-lg sm:text-xl tracking-widest text-[#FFD700] mb-4 sm:mb-6">SCRIE RECENZIA TA</h3>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-widest">RATING</label>
                    {renderStars(newReview.rating, true, (rating) => setNewReview((prev) => ({ ...prev, rating })))}
                  </div>

                  <div>
                    <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-widest">COMENTARIU</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                      placeholder="Împărtășește experiența ta cu acest parfum..."
                      className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 min-h-[100px] sm:min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button
                      type="submit"
                      className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 sm:px-8 py-2 sm:py-3 text-sm tracking-widest"
                    >
                      TRIMITE RECENZIA
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      variant="outline"
                      className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 px-6 sm:px-8 py-2 sm:py-3 text-sm tracking-widest"
                    >
                      ANULEAZĂ
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6 sm:space-y-8">
              {reviews.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Star className="h-8 w-8 sm:h-12 sm:w-12 text-[#FFD700]/50 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-[#FFD700]/70">
                    Încă nu există recenzii. Fii primul care recenzează acest parfum!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-[#FFD700]/10 pb-6 sm:pb-8">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-[#FFD700] font-medium text-sm sm:text-base">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-[#FFD700]/60 text-xs sm:text-sm">
                          {review.createdAt && new Date(review.createdAt).toLocaleDateString("ro-RO")}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-[#FFD700]/80 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
