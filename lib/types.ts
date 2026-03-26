export interface MacroTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Preferences {
  budget: number
  servings: number
  diet: string
  cuisine: string
  craving: string
}

export interface Meal {
  id: string
  name: string
  description: string
  macros: MacroTargets
  costPerServing: number
  imageUrl?: string
}

export interface Ingredient {
  id: string
  name: string
  quantity: string
  cost: number
  macros: MacroTargets
}

export interface Substitution {
  id: string
  name: string
  quantity: string
  macroDelta: MacroTargets
  costDelta: number
}

export interface Recipe {
  meal: Meal
  servings: number
  ingredients: Ingredient[]
  totalCost: number
  totalMacros: MacroTargets
  instructions: string[]
}
