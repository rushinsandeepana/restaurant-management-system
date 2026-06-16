export interface MealVariation {
  id: number
  name: string
  priceAdjustment: number
  totalPrice: number
}

export interface Meal {
  id: number
  name: string
  imageUrl: string | null
  quantity: number
  basePrice: number
  totalPrice: number
  variations: MealVariation[]
  createdAt: string
}

export interface MealVariationInput {
  name: string
  priceAdjustment: number
}

export interface CreateMealRequest {
  name: string
  imageUrl?: string
  quantity: number
  // basePrice: number
  basePrices: {
    size: string
    price: number
  }[]
  variations?: MealVariationInput[]
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}
