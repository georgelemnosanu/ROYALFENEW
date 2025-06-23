"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Users,
  ShoppingCart,
  Star,
  Tag,
  BarChart3,
  MapPin,
  CreditCard,
  Archive,
  Gift,
  Shield,
} from "lucide-react"

// Import all admin components
import ProductsAdmin from "@/components/admin/products-admin"
import CategoriesAdmin from "@/components/admin/categories-admin"
import UsersAdmin from "@/components/admin/users-admin"
import OrdersAdmin from "@/components/admin/orders-admin"
import OrderItemsAdmin from "@/components/admin/order-items-admin"
import CartAdmin from "@/components/admin/cart-admin"
import CartItemsAdmin from "@/components/admin/cart-items-admin"
import WishlistAdmin from "@/components/admin/wishlist-admin"
import ReviewsAdmin from "@/components/admin/reviews-admin"
import ShippingAddressAdmin from "@/components/admin/shipping-address-admin"
import PaymentTransactionAdmin from "@/components/admin/payment-transaction-admin"
import InventoryAdmin from "@/components/admin/inventory-admin"
import BonusCodeAdmin from "@/components/admin/bonus-code-admin"
import RoleAdmin from "@/components/admin/role-admin"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const adminSections = [
    {
      id: "products",
      label: "Products",
      icon: Package,
      description: "Manage perfume products",
      component: ProductsAdmin,
    },
    {
      id: "categories",
      label: "Categories",
      icon: Tag,
      description: "Organize product categories",
      component: CategoriesAdmin,
    },
    { id: "users", label: "Users", icon: Users, description: "Manage user accounts", component: UsersAdmin },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      description: "View and manage orders",
      component: OrdersAdmin,
    },
    {
      id: "order-items",
      label: "Order Items",
      icon: Package,
      description: "Manage order items",
      component: OrderItemsAdmin,
    },
    {
      id: "cart",
      label: "Shopping Carts",
      icon: ShoppingCart,
      description: "Manage shopping carts",
      component: CartAdmin,
    },
    {
      id: "cart-items",
      label: "Cart Items",
      icon: Archive,
      description: "Manage cart items",
      component: CartItemsAdmin,
    },
    { id: "wishlist", label: "Wishlist", icon: Star, description: "Manage user wishlists", component: WishlistAdmin },
    { id: "reviews", label: "Reviews", icon: Star, description: "Moderate product reviews", component: ReviewsAdmin },
    {
      id: "shipping",
      label: "Shipping",
      icon: MapPin,
      description: "Manage shipping addresses",
      component: ShippingAddressAdmin,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      description: "View payment transactions",
      component: PaymentTransactionAdmin,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Archive,
      description: "Manage product inventory",
      component: InventoryAdmin,
    },
    {
      id: "bonus-codes",
      label: "Bonus Codes",
      icon: Gift,
      description: "Manage discount codes",
      component: BonusCodeAdmin,
    },
    { id: "roles", label: "Roles", icon: Shield, description: "Manage user roles", component: RoleAdmin },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-[#FFD700]/20 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <svg className="w-8 h-8 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 7l5.5 4L12 4l3.5 7L21 7l-2 9H5zm2.7-2h8.6l.9-4.4L14 12l-2-4-2 4-3.2-2.4L7.7 14z" />
                </svg>
                <div className="absolute inset-0 w-8 h-8 bg-[#FFD700]/30 rounded-full blur-lg"></div>
              </div>
              <div className="text-xl font-light tracking-[0.2em] text-[#FFD700]">
                ROYAL ESSENCE
                <span className="block text-xs font-thin tracking-[0.3em] text-[#FFD700]/80">ADMIN PANEL</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10 hover:border-[#FFD700] rounded-none px-6 py-2 text-xs tracking-[0.2em]"
                >
                  BACK TO SITE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-thin tracking-[0.2em] text-[#FFD700] mb-2">ADMIN DASHBOARD</h1>
          <div className="w-24 h-px bg-[#FFD700]/50"></div>
          <p className="text-[#FFD700]/70 mt-4">Manage all aspects of Royal Essence Luxury</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-transparent h-auto p-0">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#FFD700]/20 data-[state=active]:text-[#FFD700] text-[#FFD700]/70 border border-[#FFD700]/30 rounded-none px-4 py-2"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            {adminSections.slice(0, 6).map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-[#FFD700]/20 data-[state=active]:text-[#FFD700] text-[#FFD700]/70 border border-[#FFD700]/30 rounded-none px-4 py-2"
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Second row of tabs for remaining sections */}
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent h-auto p-0">
            {adminSections.slice(6).map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-[#FFD700]/20 data-[state=active]:text-[#FFD700] text-[#FFD700]/70 border border-[#FFD700]/30 rounded-none px-4 py-2"
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section) => (
                <Card
                  key={section.id}
                  className="bg-black border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors cursor-pointer"
                  onClick={() => setActiveTab(section.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-[#FFD700] text-lg">
                      <section.icon className="h-5 w-5 mr-2" />
                      {section.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#FFD700]/70">{section.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Admin section tabs - render actual components */}
          {adminSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <section.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
