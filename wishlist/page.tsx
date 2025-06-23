"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, ShoppingCart, Trash2, Menu, X } from "lucide-react"

interface WishlistItem {
  id: number
  productId: number
  product?: {
    name: string
    description: string
    price: number
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
      const response = await fetch(`${API_BASE_URL}/wishlist/1`) // Mock user ID
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data)
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
      const response = await fetch(`${API_BASE_URL}/wishlist/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const addToCart = async (productId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // Mock user ID
          productId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        // Optionally show success message
        console.log("Added to cart successfully")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
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
                  <Heart className="h-3 w-3 sm:h-5 sm:w-5 fill-current" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-none px-2 sm:px-4 py-1 sm:py-2 text-xs tracking-[0.2em]"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">COȘ</span> (0)
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

      {/* Wishlist Content */}
      <section className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            href="/catalog"
            className="inline-flex items-center text-[#FFD700]/70 hover:text-[#FFD700] mb-8 sm:mb-12 text-sm tracking-widest"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ÎNAPOI LA COLECȚIE
          </Link>

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin tracking-[0.2em] text-[#FFD700] mb-4">
              LISTA DE DORINȚE
            </h1>
            <div className="inline-block border-t border-[#FFD700]/30 w-16 sm:w-24"></div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#FFD700] text-xl tracking-widest">SE ÎNCARCĂ...</div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Heart className="h-16 w-16 sm:h-24 sm:w-24 text-[#FFD700]/50 mx-auto mb-6 sm:mb-8" />
              <h2 className="text-xl sm:text-2xl font-light text-[#FFD700] mb-4 sm:mb-6">
                LISTA TA DE DORINȚE ESTE GOALĂ
              </h2>
              <p className="text-sm sm:text-base text-[#FFD700]/70 mb-6 sm:mb-8">
                Salvează parfumurile tale preferate pentru mai târziu
              </p>
              <Button
                asChild
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-widest"
              >
                <Link href="/catalog">EXPLOREAZĂ COLECȚIA</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="relative overflow-hidden mb-4 sm:mb-6">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      alt={item.product?.name || "Product"}
                      width={300}
                      height={400}
                      className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <Button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 bg-black/50 hover:bg-red-500/80 text-white p-2 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => addToCart(item.productId)}
                          className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm tracking-widest"
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          ADAUGĂ ÎN COȘ
                        </Button>
                        <Link href={`/product/${item.productId}`}>
                          <Button
                            variant="outline"
                            className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm tracking-widest"
                          >
                            VEZI DETALII
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="text-center px-2">
                    <h3 className="text-base sm:text-lg tracking-widest text-[#FFD700] mb-1 sm:mb-2">
                      {item.product?.name}
                    </h3>
                    <p className="text-[#FFD700]/70 text-xs sm:text-sm mb-2 line-clamp-2">
                      {item.product?.description}
                    </p>
                    <div className="text-base sm:text-lg font-light text-[#FFD700]">€{item.product?.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
