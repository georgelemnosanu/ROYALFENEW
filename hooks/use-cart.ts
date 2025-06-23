"use client"

import React, { useState, useEffect, createContext, useContext } from "react"

interface CartItem {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    imageUrl?: string
  }
}

interface Cart {
  id: number
  items: CartItem[]
}

interface CartContextType {
  cart: Cart | null
  cartItems: number
  loading: boolean
  addToCart: (productId: number, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  getCartItemsCount: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [cartItems, setCartItems] = useState<number>(0)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://llmndev.com/api/v1"
  const MOCK_USER_ID = 1 // In a real app, this would come from authentication

  useEffect(() => {
    refreshCart()
  }, [])

  useEffect(() => {
    setCartItems(getCartItemsCount())
  }, [cart])

  const refreshCart = async () => {
    try {
      setLoading(true)

      // First, get or create cart for user
      const cartResponse = await fetch(`${API_BASE_URL}/cart/by-user/${MOCK_USER_ID}`)
      let cartData: Cart

      if (!cartResponse.ok) {
        // Create new cart if doesn't exist
        const createCartResponse = await fetch(`${API_BASE_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: { id: MOCK_USER_ID } }),
        })
        cartData = await createCartResponse.json()
      } else {
        cartData = await cartResponse.json()
      }

      // Get cart items with product details
      const itemsResponse = await fetch(`${API_BASE_URL}/cart-items/by-cart/${cartData.id}`)
      if (itemsResponse.ok) {
        const items = await itemsResponse.json()
        cartData.items = items
      } else {
        cartData.items = []
      }

      setCart(cartData)
    } catch (error) {
      console.error("Error refreshing cart:", error)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      setLoading(true)

      if (!cart) {
        await refreshCart()
        return
      }

      // Check if item already exists in cart
      const existingItem = cart.items.find((item) => item.product.id === productId)

      if (existingItem) {
        // Update existing item quantity
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        // Add new item to cart
        const response = await fetch(`${API_BASE_URL}/cart-items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: { id: cart.id },
            product: { id: productId },
            quantity: quantity,
          }),
        })

        if (response.ok) {
          await refreshCart()
        } else {
          throw new Error("Failed to add item to cart")
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/cart-items/${cartItemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await refreshCart()
      } else {
        throw new Error("Failed to remove item from cart")
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setLoading(true)

      if (quantity <= 0) {
        await removeFromCart(cartItemId)
        return
      }

      const response = await fetch(`${API_BASE_URL}/cart-items/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cartItemId,
          quantity: quantity,
        }),
      })

      if (response.ok) {
        await refreshCart()
      } else {
        throw new Error("Failed to update item quantity")
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)

      if (!cart) return

      // Delete all cart items
      const deletePromises = cart.items.map((item) =>
        fetch(`${API_BASE_URL}/cart-items/${item.id}`, { method: "DELETE" }),
      )

      await Promise.all(deletePromises)
      await refreshCart()
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getCartTotal = (): number => {
    if (!cart) return 0
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getCartItemsCount = (): number => {
    if (!cart) return 0
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const contextValue: CartContextType = {
    cart,
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    refreshCart,
  }

  return React.createElement(CartContext.Provider, { value: contextValue }, children)
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
