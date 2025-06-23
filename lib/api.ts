// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

// Base API function cu logging pentru debugging
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  console.log(`🔗 Making API request to: ${url}`)
  console.log(`📝 Method: ${options.method || "GET"}`)
  console.log(`📦 Body:`, options.body)

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    console.log(`📡 Response status: ${response.status}`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Response data:`, data)
    return data
  } catch (error) {
    console.error(`❌ API Request failed:`, error)
    throw error
  }
}

// Updated Category interface - simplified
export interface Category {
  id?: number
  name: string
  description?: string
}

// Generic CRUD service creator
function createCrudService<T extends { id?: number }>(endpoint: string) {
  return {
    async getAll(): Promise<T[]> {
      console.log(`🔍 Getting all ${endpoint}`)
      return apiRequest<T[]>(`/${endpoint}`)
    },

    async getById(id: number): Promise<T> {
      console.log(`🔍 Getting ${endpoint} by id: ${id}`)
      return apiRequest<T>(`/${endpoint}/${id}`)
    },

    async create(data: Omit<T, "id">): Promise<T> {
      console.log(`➕ Creating ${endpoint}:`, data)
      return apiRequest<T>(`/${endpoint}`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },

    async update(id: number, data: Partial<Omit<T, "id">>): Promise<T> {
      console.log(`✏️ Updating ${endpoint} ${id}:`, data)
      return apiRequest<T>(`/${endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },

    async delete(id: number): Promise<void> {
      console.log(`🗑️ Deleting ${endpoint} ${id}`)
      return apiRequest<void>(`/${endpoint}/${id}`, {
        method: "DELETE",
      })
    },
  }
}

// Services
export const categoryService = createCrudService<Category>("categories")

// Export other interfaces and services...
export interface Product {
  id?: number
  name: string
  description?: string
  brand?: string
  price: number
  stock: number
  categoryId?: number
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id?: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  fullName: string
  phone?: string
  password?: string
  enabled?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  id?: number
  userId?: number
  totalAmount?: number
  totalPrice: number
  status: OrderStatus
  shippingAddressId: number
  createdAt?: string
  updatedAt?: string
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface OrderItem {
  id?: number
  orderId: number
  productId: number
  quantity: number
  price: number
}

export interface Cart {
  id?: number
  userId: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id?: number
  cartId: number
  productId: number
  quantity: number
}

export interface Wishlist {
  id?: number
  userId: number
  productId: number
  createdAt?: string
}

export interface Review {
  id?: number
  userId: number
  productId: number
  rating: number
  comment?: string
  createdAt?: string
}

export interface ShippingAddress {
  id?: number
  userId: number
  recipientName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface PaymentTransaction {
  id?: number
  orderId: number
  amount: number
  currency: string
  paymentMethod: string
  providerReference?: string
  status: PaymentStatus
  transactionDate?: string
}

export type PaymentStatus = "INITIATED" | "COMPLETED" | "FAILED"

export interface Inventory {
  id?: number
  productId: number
  quantity: number
  lastUpdated?: string
}

export interface BonusCode {
  id?: number
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  validFrom: string
  validTo: string
  usageLimit?: number
  timesUsed: number
  minOrderValue?: number
  status: BonusCodeStatus
}

export type DiscountType = "PERCENTAGE" | "FIXED"
export type BonusCodeStatus = "ACTIVE" | "EXPIRED" | "USED_UP"

export interface Role {
  id?: number
  name: string
}

export interface ProductImage {
  id?: number
  productId: number
  imageUrl: string
  altText?: string
  isPrimary?: boolean
}

export const productService = createCrudService<Product>("products")
export const userService = createCrudService<User>("users")
export const orderService = {
  ...createCrudService<Order>("orders"),
  async getAll(): Promise<{ content: Order[] }> {
    return apiRequest<{ content: Order[] }>("/orders")
  },
}
export const orderItemService = createCrudService<OrderItem>("order-items")
export const cartService = createCrudService<Cart>("carts")
export const cartItemService = createCrudService<CartItem>("cart-items")
export const wishlistService = createCrudService<Wishlist>("wishlist")
export const reviewService = createCrudService<Review>("reviews")
export const shippingAddressService = createCrudService<ShippingAddress>("shipping-addresses")
export const paymentTransactionService = createCrudService<PaymentTransaction>("payment-transactions")
export const inventoryService = createCrudService<Inventory>("inventory")
export const bonusCodeService = createCrudService<BonusCode>("bonus-codes")
export const roleService = createCrudService<Role>("roles")
export const productImageService = createCrudService<ProductImage>("product-images")
