export interface MealVariation {
  id: number
  name: string
  price: number
}

export interface Meal {
  id: number
  name: string
  description: string
  imageUrl: string | null
  categoryId: number
  status: string
  basePrice: number
  totalPrice: number
  variations: MealVariation[]
  modifierIds: number[]
  createdAt: string
  updatedAt: string
}

export interface MealVariationInput {
  name: string
  price: number
  status: string
}

export interface CreateMealRequest {
  name: string
  imageUrl?: string
  categoryId: number
  status: string
  description?: string
  variations: MealVariationInput[]
  modifierIds: number[]
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
