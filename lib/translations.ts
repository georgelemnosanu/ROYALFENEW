"use client"

import { useState, useEffect } from "react"

export type Language = "ro" | "en"

export interface Translations {
  // Navigation
  home: string
  collection: string
  story: string
  contact: string
  cart: string

  // Homepage
  luxury_arabian_perfumes: string
  crafted_in_desert: string
  discover_collection: string
  explore_story: string
  signature_collection: string
  view_details: string

  // Product
  add_to_cart: string
  add_to_wishlist: string
  remove_from_wishlist: string
  price: string
  description: string
  ingredients: string

  // Cart
  your_cart: string
  empty_cart: string
  continue_shopping: string
  checkout: string
  total: string
  quantity: string
  remove: string

  // Common
  loading: string
  error: string
  success: string
  back: string
  next: string
  previous: string
}

const translations: Record<Language, Translations> = {
  ro: {
    // Navigation
    home: "ACASĂ",
    collection: "COLECȚIE",
    story: "POVESTE",
    contact: "CONTACT",
    cart: "COȘ",

    // Homepage
    luxury_arabian_perfumes: "PARFUMURI ARABEȘTI DE LUX",
    crafted_in_desert: "Create în Inima Deșertului",
    discover_collection: "DESCOPERĂ COLECȚIA",
    explore_story: "EXPLOREAZĂ POVESTEA",
    signature_collection: "COLECȚIA SEMNĂTURĂ",
    view_details: "VEZI DETALII",

    // Product
    add_to_cart: "ADAUGĂ ÎN COȘ",
    add_to_wishlist: "ADAUGĂ LA FAVORITE",
    remove_from_wishlist: "ELIMINĂ DIN FAVORITE",
    price: "PREȚ",
    description: "DESCRIERE",
    ingredients: "INGREDIENTE",

    // Cart
    your_cart: "COȘUL TĂU",
    empty_cart: "Coșul este gol",
    continue_shopping: "CONTINUĂ CUMPĂRĂTURILE",
    checkout: "FINALIZEAZĂ COMANDA",
    total: "TOTAL",
    quantity: "CANTITATE",
    remove: "ELIMINĂ",

    // Common
    loading: "Se încarcă...",
    error: "Eroare",
    success: "Succes",
    back: "ÎNAPOI",
    next: "URMĂTORUL",
    previous: "PRECEDENTUL",
  },
  en: {
    // Navigation
    home: "HOME",
    collection: "COLLECTION",
    story: "STORY",
    contact: "CONTACT",
    cart: "CART",

    // Homepage
    luxury_arabian_perfumes: "LUXURY ARABIAN PERFUMES",
    crafted_in_desert: "Crafted in the Heart of the Desert",
    discover_collection: "DISCOVER COLLECTION",
    explore_story: "EXPLORE STORY",
    signature_collection: "SIGNATURE COLLECTION",
    view_details: "VIEW DETAILS",

    // Product
    add_to_cart: "ADD TO CART",
    add_to_wishlist: "ADD TO WISHLIST",
    remove_from_wishlist: "REMOVE FROM WISHLIST",
    price: "PRICE",
    description: "DESCRIPTION",
    ingredients: "INGREDIENTS",

    // Cart
    your_cart: "YOUR CART",
    empty_cart: "Cart is empty",
    continue_shopping: "CONTINUE SHOPPING",
    checkout: "CHECKOUT",
    total: "TOTAL",
    quantity: "QUANTITY",
    remove: "REMOVE",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    back: "BACK",
    next: "NEXT",
    previous: "PREVIOUS",
  },
}

export function useSimpleLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ro") // Default to Romanian

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("preferred-language", language)
  }

  return {
    currentLanguage,
    changeLanguage,
    t: translations[currentLanguage],
    availableLanguages: Object.keys(translations) as Language[],
  }
}
