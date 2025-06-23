"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Search, Menu, X } from "lucide-react"
import { productService, categoryService, type Product, type Category } from "@/lib/api"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([productService.getAll(), categoryService.getAll()])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.categoryId?.toString() === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation - Mobile First */}
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
                className="text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                COLECȚIE
                <div className="absolute -bottom-1 left-0 w-full h-px bg-[#FFD700]"></div>
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
                  className="text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
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

      {/* Header - Mobile First */}
      <section className="pt-20 sm:pt-32 pb-8 sm:pb-16 bg-black relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Desert background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin tracking-[0.2em] text-[#FFD700]">COLECȚIA</h1>
            <div className="inline-block border-t border-[#FFD700]/30 w-16 sm:w-24 my-4 sm:my-6"></div>
            <p className="text-sm sm:text-base text-[#FFD700]/70 tracking-wider px-4">
              Descoperă parfumurile noastre exclusive, fiecare o capodoperă a parfumeriei arabești
            </p>
          </div>
        </div>
      </section>

      {/* Filters - Enhanced Design */}
      <section className="py-6 sm:py-8 bg-gradient-to-b from-black to-gray-900 border-b border-[#FFD700]/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#FFD700]/50 h-4 w-4" />
                <Input
                  placeholder="Caută parfumuri..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-black/40 border-2 border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 text-sm rounded-full backdrop-blur-sm focus:border-[#FFD700] focus:bg-black/60 transition-all duration-300"
                />
              </div>
              <div className="flex gap-3 sm:gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 sm:w-48 bg-black/40 border-2 border-[#FFD700]/30 text-[#FFD700] text-sm rounded-full backdrop-blur-sm focus:border-[#FFD700] hover:bg-black/60 transition-all duration-300">
                    <SelectValue placeholder="Toate" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-[#FFD700]/30 backdrop-blur-md">
                    <SelectItem value="all" className="text-[#FFD700] hover:bg-[#FFD700]/10">
                      Toate Categoriile
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id?.toString() || ""}
                        className="text-[#FFD700] hover:bg-[#FFD700]/10"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="name">
                  <SelectTrigger className="w-32 sm:w-40 bg-black/40 border-2 border-[#FFD700]/30 text-[#FFD700] text-sm rounded-full backdrop-blur-sm focus:border-[#FFD700] hover:bg-black/60 transition-all duration-300">
                    <SelectValue placeholder="Sortare" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-[#FFD700]/30 backdrop-blur-md">
                    <SelectItem value="name" className="text-[#FFD700] hover:bg-[#FFD700]/10">
                      Nume A-Z
                    </SelectItem>
                    <SelectItem value="price-low" className="text-[#FFD700] hover:bg-[#FFD700]/10">
                      Preț Mic
                    </SelectItem>
                    <SelectItem value="price-high" className="text-[#FFD700] hover:bg-[#FFD700]/10">
                      Preț Mare
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#FFD700]/70">
                <span className="font-medium text-[#FFD700]">{filteredProducts.length}</span> parfumuri găsite
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FFD700] hover:bg-[#FFD700]/10 border border-[#FFD700]/20 hover:border-[#FFD700]/40 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                    <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                    <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                    <div className="bg-current w-1.5 h-1.5 rounded-sm"></div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FFD700]/50 hover:bg-[#FFD700]/10 border border-[#FFD700]/20 hover:border-[#FFD700]/40 rounded-lg"
                >
                  <div className="flex flex-col gap-0.5 w-4 h-4">
                    <div className="bg-current w-full h-0.5 rounded-sm"></div>
                    <div className="bg-current w-full h-0.5 rounded-sm"></div>
                    <div className="bg-current w-full h-0.5 rounded-sm"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid - Enhanced Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-80 sm:h-96 w-full mb-6 rounded-lg"></div>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 h-6 w-3/4 mb-3 rounded"></div>
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="space-y-6">
                <div className="text-6xl sm:text-8xl">🔍</div>
                <h3 className="text-2xl sm:text-3xl font-light text-[#FFD700] tracking-wide">Nu s-au găsit produse</h3>
                <p className="text-base sm:text-lg text-[#FFD700]/70 max-w-md mx-auto">
                  Încearcă să ajustezi căutarea sau filtrele pentru a găsi parfumul perfect
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  variant="outline"
                  className="border-2 border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-full px-8 py-3 text-sm tracking-wider transition-all duration-300"
                >
                  Resetează filtrele
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-black border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFD700]/10">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=400&width=300&text=Parfum"
                        }}
                      />
                    ) : (
                      <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-[#FFD700]/50 text-center">
                          <div className="text-4xl sm:text-6xl mb-4">🌟</div>
                          <div className="text-sm sm:text-base tracking-wider">PARFUM EXCLUSIV</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link href={`/product/${product.id}`}>
                        <Button
                          variant="outline"
                          className="text-[#FFD700] border-2 border-[#FFD700]/60 bg-black/60 backdrop-blur-md hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-full px-8 py-3 text-sm tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/25"
                        >
                          VEZI DETALII
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 text-center px-2">
                    <h3 className="text-lg sm:text-xl tracking-widest text-[#FFD700] mb-2 font-light">
                      {product.name}
                    </h3>
                    <p className="text-[#FFD700]/70 text-sm mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="text-xl font-light text-[#FFD700] flex items-center justify-center">
                      <span className="text-sm mr-1">€</span>
                      {product.price}
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
