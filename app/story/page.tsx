"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, ShoppingCart, Sparkles, Crown, Leaf, Award, Users, Globe, Star, Menu, X } from "lucide-react"

export default function StoryPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const milestones = [
    {
      year: "1985",
      title: "Începuturile în Dubai",
      description: "Fondarea Royal Essence în inima deșertului, cu o viziune de a crea parfumuri de lux autentice.",
      icon: Crown,
    },
    {
      year: "1992",
      title: "Prima Colecție Exclusivă",
      description: "Lansarea primei colecții de parfumuri cu ingrediente rare din Orient și Occident.",
      icon: Sparkles,
    },
    {
      year: "2001",
      title: "Expansiunea Internațională",
      description: "Deschiderea primelor boutique-uri în Europa și America, aducând luxul arab în lume.",
      icon: Globe,
    },
    {
      year: "2010",
      title: "Inovația Sustenabilă",
      description: "Implementarea practicilor eco-friendly și parteneriatul cu producători locali.",
      icon: Leaf,
    },
    {
      year: "2018",
      title: "Recunoaștere Mondială",
      description: "Câștigarea premiilor internaționale pentru excelența în parfumerie de lux.",
      icon: Award,
    },
    {
      year: "2024",
      title: "Viitorul Parfumeriei",
      description: "Continuăm să inovăm cu tehnologii moderne păstrând tradițiile ancestrale.",
      icon: Star,
    },
  ]

  const values = [
    {
      title: "AUTENTICITATE",
      description: "Fiecare parfum este creat cu respectul pentru tradițiile milenare ale parfumeriei arabe.",
      icon: Crown,
    },
    {
      title: "CALITATE SUPREMĂ",
      description: "Folosim doar cele mai fine ingrediente, selectate cu grijă din întreaga lume.",
      icon: Award,
    },
    {
      title: "MEȘTEȘUG ARTIZANAL",
      description: "Fiecare sticlă este creată manual de maeștri parfumieri cu experiență de decenii.",
      icon: Users,
    },
    {
      title: "SUSTENABILITATE",
      description: "Ne angajăm să protejăm mediul prin practici responsabile și ingrediente etice.",
      icon: Leaf,
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
                className="text-[#FFD700] transition-all duration-300 text-sm tracking-[0.2em] relative group"
              >
                POVESTE
                <div className="absolute -bottom-1 left-0 w-full h-px bg-[#FFD700]"></div>
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
                  className="text-[#FFD700] text-sm tracking-[0.2em] py-2 px-4 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
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

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Royal Essence story background"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-[#FFD700]/70 hover:text-[#FFD700] mb-6 sm:mb-8 text-sm tracking-widest transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            ÎNAPOI ACASĂ
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin tracking-[0.2em] text-[#FFD700] mb-4 sm:mb-6">
              POVESTEA NOASTRĂ
            </h1>
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            </div>
            <p className="text-sm sm:text-base md:text-xl font-light tracking-wider text-[#FFD700]/90 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
              De aproape patru decenii, Royal Essence creează parfumuri de lux care captează esența tradițiilor arabe și
              le îmbină cu eleganța modernă.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-[#FFD700] mb-4 sm:mb-6">
                NĂSCUTĂ ÎN DEȘERT
              </h2>
              <div className="space-y-4 sm:space-y-6 text-[#FFD700]/80 leading-relaxed">
                <p className="text-sm sm:text-base">
                  În 1985, în inima deșertului din Dubai, maestrul parfumier Ahmed Al-Rashid a avut o viziune: să creeze
                  parfumuri care să capteze magia și misterul Orientului, folosind cele mai rare și prețioase
                  ingrediente din lume.
                </p>
                <p className="text-sm sm:text-base">
                  Inspirat de tradițiile milenare ale parfumeriei arabe și de frumusețea peisajelor deșertice, a fondat
                  Royal Essence cu misiunea de a aduce luxul autentic arab în fiecare colț al lumii.
                </p>
                <p className="text-sm sm:text-base">
                  Astăzi, după aproape patru decenii, continuăm să respectăm aceleași principii de excelență și
                  autenticitate, creând parfumuri care povestesc istorii și trezesc emoții profunde.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Maestrul parfumier în atelier"
                  width={500}
                  height={600}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-[#FFD700] mb-4 sm:mb-6">
              CĂLĂTORIA NOASTRĂ
            </h2>
            <div className="flex justify-center">
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFD700]/50 via-[#FFD700] to-[#FFD700]/50 transform md:-translate-x-1/2"></div>

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-8 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#FFD700] rounded-full transform md:-translate-x-1/2 z-10">
                    <div className="absolute inset-0 bg-[#FFD700]/30 rounded-full animate-pulse scale-150"></div>
                  </div>

                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pr-8 lg:pr-12" : "md:pl-8 lg:pl-12"}`}>
                    <Card className="bg-gray-900 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 ml-8 sm:ml-12 md:ml-0">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center mb-3 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center mr-3 sm:mr-4">
                            <milestone.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFD700]" />
                          </div>
                          <div>
                            <div className="text-lg sm:text-xl font-light text-[#FFD700] tracking-wider">
                              {milestone.year}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-base sm:text-lg font-medium text-[#FFD700] mb-2 sm:mb-3 tracking-wide">
                          {milestone.title}
                        </h3>
                        <p className="text-[#FFD700]/70 text-sm sm:text-base leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-[#FFD700] mb-4 sm:mb-6">
              VALORILE NOASTRE
            </h2>
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
            </div>
            <p className="text-sm sm:text-base text-[#FFD700]/80 max-w-2xl mx-auto leading-relaxed">
              Principiile care ne ghidează în crearea fiecărui parfum și în construirea relațiilor cu clienții noștri
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-black border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 group text-center"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/30 transition-colors">
                    <value.icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD700]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-medium text-[#FFD700] mb-2 sm:mb-3 tracking-widest">
                    {value.title}
                  </h3>
                  <p className="text-[#FFD700]/70 text-xs sm:text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-[#FFD700] mb-4 sm:mb-6">
              ALĂTURĂ-TE POVEȘTII NOASTRE
            </h2>
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-[#FFD700]/80 mb-6 sm:mb-8 leading-relaxed">
              Descoperă colecția noastră exclusivă și lasă-te purtat de aromele care au cucerit lumea. Fiecare parfum
              este o invitație la o călătorie senzorială unică.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md mx-auto">
              <Button
                asChild
                className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-[0.2em] transition-all duration-300"
              >
                <Link href="/catalog">
                  EXPLOREAZĂ COLECȚIA
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="text-[#FFD700] border-[#FFD700]/60 hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-[0.2em]"
              >
                <Link href="/contact">CONTACTEAZĂ-NE</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
