"use client"

import React, { useState, useEffect, createContext, useContext } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  loading: boolean
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (itemId: string) => void
  toggleWishlist: (item: WishlistItem) => void
  isInWishlist: (itemId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

interface WishlistProviderProps {
  children: React.ReactNode
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // Load wishlist from local storage on component mount
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist))
    }
  }, [])

  useEffect(() => {
    // Save wishlist to local storage whenever it changes
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((wishlistItem) => wishlistItem.id === item.id)
      if (!exists) {
        return [...prevItems, item]
      }
      return prevItems
    })
  }

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const toggleWishlist = (item: WishlistItem) => {
    const exists = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id)
    if (exists) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  const isInWishlist = (itemId: string): boolean => {
    return wishlistItems.some((item) => item.id === itemId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const contextValue: WishlistContextType = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  }

  return React.createElement(WishlistContext.Provider, { value: contextValue }, children)
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
