"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
  ShoppingCart,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  X,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          })
        }, 3000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "VIZITEAZĂ BOUTIQUE-UL NOSTRU",
      details: ["Royal Essence Luxury", "Bulevardul Palatului Desert 123", "Dubai, UAE 12345"],
    },
    {
      icon: Phone,
      title: "SUNĂ-NE",
      details: ["+971 4 123 4567", "+971 50 123 4567", "Gratuit: 800-ROYAL"],
    },
    {
      icon: Mail,
      title: "TRIMITE-NE EMAIL",
      details: ["info@royalessence.com", "comenzi@royalessence.com", "suport@royalessence.com"],
    },
    {
      icon: Clock,
      title: "PROGRAM DE LUCRU",
      details: ["Luni - Vineri: 10:00 - 22:00", "Sâmbătă: 10:00 - 23:00", "Duminică: 12:00 - 20:00"],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
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
                className="text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                CONTACT
                <div className="absolute -bottom-1 left-0 w-full h-px bg-[#FFD700]"></div>
              </Link>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FFD700] hover:bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/40 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="outline"
                  className="text-[#FFD700] border-[#FFD700]/60 hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-full px-2 sm:px-3 md:px-6 py-1 sm:py-2 text-xs tracking-[0.1em]"
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline text-xs">COȘ</span>
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
                  className="text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CONTACT
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Luxury contact background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-[#FFD700]/70 hover:text-[#FFD700] mb-4 sm:mb-6 md:mb-8 text-sm tracking-widest transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ÎNAPOI ACASĂ
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin tracking-[0.2em] text-[#FFD700] mb-3 sm:mb-4 md:mb-6">
              INTRĂ ÎN CONTACT
            </h1>
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <div className="w-12 sm:w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            </div>
            <p className="text-sm sm:text-base md:text-xl font-light tracking-wider text-[#FFD700]/90 mb-6 sm:mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
              Experimentează luxul serviciului personalizat. Consultanții noștri de parfumuri sunt aici să te ajute
              să-ți descoperi parfumul perfect.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <Card className="bg-black border-[#FFD700]/20 shadow-2xl">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl font-thin tracking-[0.2em] text-[#FFD700] text-center">
                    TRIMITE-NE UN MESAJ
                  </CardTitle>
                  <div className="flex justify-center">
                    <div className="w-10 sm:w-12 md:w-16 h-px bg-[#FFD700]/50"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 md:space-y-6">
                  {isSubmitted ? (
                    <div className="text-center py-6 sm:py-8 md:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                        <Send className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD700]" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl text-[#FFD700] mb-2 tracking-widest">
                        MESAJ TRIMIS!
                      </h3>
                      <p className="text-[#FFD700]/70 text-sm">
                        Mulțumim că ne-ai contactat. Îți vom răspunde în 24 de ore.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-wider">PRENUME</label>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 focus:border-[#FFD700] h-10 sm:h-12"
                            placeholder="Prenumele tău"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-wider">NUME</label>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 focus:border-[#FFD700] h-10 sm:h-12"
                            placeholder="Numele tău"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-wider">EMAIL</label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 focus:border-[#FFD700] h-10 sm:h-12"
                            placeholder="email@tau.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-wider">TELEFON</label>
                          <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 focus:border-[#FFD700] h-10 sm:h-12"
                            placeholder="+40 123 456 789"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-wider">SUBIECT</label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 focus:border-[#FFD700] h-10 sm:h-12"
                          placeholder="Cum te putem ajuta?"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#FFD700]/80 mb-2 text-sm tracking-wider">MESAJ</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="bg-transparent border-[#FFD700]/30 text-[#FFD700] placeholder-[#FFD700]/50 focus:border-[#FFD700] min-h-[100px] sm:min-h-[120px] md:min-h-[150px] resize-none"
                          placeholder="Spune-ne despre preferințele tale de parfumuri sau orice întrebări ai..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black/60 border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black py-3 sm:py-4 text-sm tracking-[0.3em] transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mr-2"></div>
                            SE TRIMITE...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="mr-2 h-4 w-4" />
                            TRIMITE MESAJ
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2 space-y-4 sm:space-y-6 md:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-thin tracking-[0.2em] text-[#FFD700] mb-3 sm:mb-4">
                  VIZITEAZĂ LUMEA NOASTRĂ
                </h2>
                <p className="text-[#FFD700]/80 leading-relaxed text-sm">
                  Intră în boutique-ul nostru de lux și cufundă-te în arta parfumeriei arabe. Consultanții noștri
                  experți te vor ghida prin colecția noastră exclusivă.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="bg-black border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 group"
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/30 transition-colors">
                            <info.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#FFD700]" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm md:text-base font-medium tracking-widest text-[#FFD700] mb-1 sm:mb-2">
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-xs text-[#FFD700]/70 break-words">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Media */}
              <Card className="bg-black border-[#FFD700]/20">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-sm sm:text-base md:text-lg font-medium tracking-widest text-[#FFD700] mb-3 sm:mb-4 text-center lg:text-left">
                    URMĂREȘTE-NE
                  </h3>
                  <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#FFD700] hover:bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/40 w-8 h-8 sm:w-10 sm:h-10"
                    >
                      <Instagram className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#FFD700] hover:bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/40 w-8 h-8 sm:w-10 sm:h-10"
                    >
                      <Facebook className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#FFD700] hover:bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 hover:border-[#FFD700]/40 w-8 h-8 sm:w-10 sm:h-10"
                    >
                      <Twitter className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
