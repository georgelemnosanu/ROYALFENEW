"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, ShoppingCart, Star, Sparkles, Menu, X } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      // Simulez încărcarea produselor
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Desert Rose",
          description: "A luxurious blend of rose and oud",
          price: 299,
          imageUrl: "/placeholder.svg?height=500&width=400",
        },
        {
          id: 2,
          name: "Golden Sands",
          description: "Warm amber and sandalwood notes",
          price: 349,
          imageUrl: "/placeholder.svg?height=500&width=400",
        },
        {
          id: 3,
          name: "Royal Oud",
          description: "Pure oud with jasmine accents",
          price: 499,
          imageUrl: "/placeholder.svg?height=500&width=400",
        },
      ]
      setFeaturedProducts(mockProducts)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      {/* Navigation - Mobile First */}
      <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-xl border-b border-[#FFD700]/20 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700] transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z" />
                </svg>
                <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#FFD700]/30 rounded-full blur-lg animate-pulse"></div>
              </div>
              <div className="text-sm sm:text-lg md:text-xl font-light tracking-[0.2em] text-[#FFD700]">
                ROYAL ESSENCE
                <span className="block text-xs font-thin tracking-[0.3em] text-[#FFD700]/80">LUXURY</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              <Link
                href="/"
                className="text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                ACASĂ
                <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[#FFD700] to-[#FFD700]/50"></div>
              </Link>
              <Link
                href="/catalog"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                COLECȚIE
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#FFD700] to-[#FFD700]/50 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                href="/story"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                POVESTE
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#FFD700] to-[#FFD700]/50 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link
                href="/contact"
                className="text-[#FFD700]/80 hover:text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                CONTACT
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#FFD700] to-[#FFD700]/50 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>

            {/* Mobile & Desktop Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition-all duration-300 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/40 backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10"
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="text-[#FFD700] border-[#FFD700]/60 hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-full px-2 sm:px-3 md:px-6 py-1 sm:py-2 text-xs tracking-[0.1em] transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/25 backdrop-blur-sm"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline text-xs">COȘ</span> (0)
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
                  className="text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
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

      {/* Hero Section - Mobile First - Reduced gaps */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/desert-hero.jpg"
            alt="Desert luxury with camel and perfumes"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
            <div className="w-16 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
          </div>

          <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
            <div className="relative group">
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#FFD700] transition-transform group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z" />
              </svg>
              <div className="absolute inset-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#FFD700]/30 rounded-full blur-xl animate-pulse"></div>
              <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 text-[#FFD700]/60 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-thin tracking-[0.3em] text-[#FFD700] mb-2 sm:mb-3 relative">
            <span className="relative inline-block">
              ROYAL
              <div className="absolute -inset-1 sm:-inset-2 bg-[#FFD700]/20 blur-2xl sm:blur-3xl rounded-full"></div>
            </span>
            <span className="block mt-1 sm:mt-2 relative inline-block">
              ESSENCE
              <div className="absolute -inset-1 sm:-inset-2 bg-[#FFD700]/20 blur-2xl sm:blur-3xl rounded-full"></div>
            </span>
          </h1>

          <div className="flex justify-center items-center my-3 sm:my-4 md:my-6">
            <div className="w-4 sm:w-6 md:w-8 h-px bg-[#FFD700]/70"></div>
            <div className="mx-2 sm:mx-3 md:mx-4 w-1.5 h-1.5 sm:w-2 sm:h-2 border border-[#FFD700]/70 rotate-45 animate-pulse"></div>
            <div className="w-4 sm:w-6 md:w-8 h-px bg-[#FFD700]/70"></div>
          </div>

          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-light tracking-[0.2em] sm:tracking-[0.4em] text-[#FFD700] max-w-xs sm:max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 leading-relaxed px-4 sm:px-0">
            PARFUMURI ARABE DE LUX
            <span className="block text-xs sm:text-base md:text-lg mt-1 sm:mt-2 text-[#FFD700]/80 tracking-[0.1em] sm:tracking-[0.2em]">
              MEȘTEȘUGITE ÎN INIMA DEȘERTULUI
            </span>
          </p>

          <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:space-y-0 md:space-x-6 justify-center max-w-xs sm:max-w-md md:max-w-none mx-auto px-4 sm:px-0">
            <Button
              asChild
              variant="outline"
              className="bg-black/40 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-medium rounded-full px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFD700]/25 relative overflow-hidden group backdrop-blur-sm"
            >
              <Link href="/catalog">
                <span className="relative z-10 flex items-center justify-center">
                  DESCOPERĂ COLECȚIA
                  <ArrowRight className="ml-2 sm:ml-3 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-[#FFD700] hover:text-[#FFD700] border border-[#FFD700]/40 hover:border-[#FFD700] hover:bg-[#FFD700]/10 rounded-full px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-300 backdrop-blur-sm"
            >
              <Link href="/story">EXPLOREAZĂ POVESTEA</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collection - Mobile First - Reduced gaps */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-[#FFD700] mb-3 sm:mb-4">
              COLECȚIA SEMNĂTURĂ
            </h2>
            <div className="flex justify-center">
              <div className="w-12 sm:w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-64 sm:h-80 w-full mb-4 sm:mb-6 rounded-lg"></div>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 h-4 sm:h-6 w-3/4 mx-auto rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500">
                    <Image
                      src={product.imageUrl || "/placeholder.svg?height=500&width=400"}
                      alt={product.name}
                      width={400}
                      height={500}
                      className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link href={`/product/${product.id}`}>
                        <Button
                          variant="outline"
                          className="text-[#FFD700] border-[#FFD700]/60 bg-black/60 backdrop-blur-md hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-xs sm:text-sm tracking-widest transition-all duration-300"
                        >
                          VEZI DETALII
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 text-center px-2">
                    <h3 className="text-base sm:text-lg md:text-xl tracking-widest text-[#FFD700] mb-1 sm:mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[#FFD700]/70 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="text-base sm:text-lg font-light text-[#FFD700] flex items-center justify-center">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 fill-current" />€{product.price}
                    </div>
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
