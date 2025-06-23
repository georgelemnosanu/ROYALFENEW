"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Heart, Menu, X } from "lucide-react"

interface CartItem {
  id: number
  productId: number
  quantity: number
  product?: {
    name: string
    description: string
    price: number
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [mobile, setMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadCart()
    const checkMobile = () => setMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const loadCart = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://lmndev.com/api/v1"
      const response = await fetch(`${API_BASE_URL}/cart/1`) // Mock user ID
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://lmndev.com/api/v1"
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal + shipping

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
                  <span className="hidden sm:inline">COȘ</span> ({cartItems.length})
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

      {/* Cart Content */}
      <section className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            href="/catalog"
            className="inline-flex items-center text-[#FFD700]/70 hover:text-[#FFD700] mb-8 sm:mb-12 text-sm tracking-widest"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            CONTINUĂ CUMPĂRĂTURILE
          </Link>

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin tracking-[0.2em] text-[#FFD700] mb-4">
              COȘUL TĂU
            </h1>
            <div className="inline-block border-t border-[#FFD700]/30 w-16 sm:w-24"></div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#FFD700] text-xl tracking-widest">SE ÎNCARCĂ...</div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <ShoppingCart className="h-16 w-16 sm:h-24 sm:w-24 text-[#FFD700]/50 mx-auto mb-6 sm:mb-8" />
              <h2 className="text-xl sm:text-2xl font-light text-[#FFD700] mb-4 sm:mb-6">COȘUL TĂU ESTE GOL</h2>
              <p className="text-sm sm:text-base text-[#FFD700]/70 mb-6 sm:mb-8">
                Descoperă colecția noastră de parfumuri de lux
              </p>
              <Button
                asChild
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-widest"
              >
                <Link href="/catalog">EXPLOREAZĂ COLECȚIA</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b border-[#FFD700]/20 pb-6 sm:pb-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="w-full sm:w-32 h-32 sm:h-32 flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=128&width=128"
                          alt={item.product?.name || "Product"}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-lg sm:text-xl tracking-widest text-[#FFD700] mb-1 sm:mb-2">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-[#FFD700]/70 line-clamp-2">{item.product?.description}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 w-8 h-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-[#FFD700] w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 w-8 h-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end space-x-4">
                            <div className="text-lg font-light text-[#FFD700]">
                              €{((item.product?.price || 0) * item.quantity).toFixed(2)}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 w-8 h-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border border-[#FFD700]/20 p-6 sm:p-8 sticky top-32">
                  <h2 className="text-xl sm:text-2xl font-thin tracking-[0.2em] text-[#FFD700] mb-6 sm:mb-8">
                    SUMAR COMANDĂ
                  </h2>

                  <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-[#FFD700]/80">Subtotal</span>
                      <span className="text-[#FFD700]">€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-[#FFD700]/80">Transport</span>
                      <span className="text-[#FFD700]">{shipping === 0 ? "GRATUIT" : `€${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[#FFD700]/60">Transport gratuit pentru comenzi peste €100</p>
                    )}
                    <div className="border-t border-[#FFD700]/20 pt-4">
                      <div className="flex justify-between text-lg sm:text-xl font-light">
                        <span className="text-[#FFD700]">Total</span>
                        <span className="text-[#FFD700]">€{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <Input
                      placeholder="Cod promoțional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50"
                    />
                    <Button
                      variant="outline"
                      className="w-full border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 text-sm tracking-widest"
                    >
                      APLICĂ COD
                    </Button>
                  </div>

                  <Button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black py-4 sm:py-6 text-sm tracking-widest">
                    FINALIZEAZĂ COMANDA
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
