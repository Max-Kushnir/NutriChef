import { z } from 'zod'
import type {
  Ingredient,
  MacroTargets,
  Meal,
  Preferences,
  Recipe,
  Substitution,
} from '@/lib/types'

const fallbackApiBaseUrl = 'http://localhost:3001'

const macrosSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
})

const apiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.unknown().optional(),
  }),
})

const generateMealsResponseSchema = z.object({
  meals: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        macros: macrosSchema,
        cost_per_serving: z.number().nonnegative(),
      }),
    )
    .min(5)
    .max(8),
})

const generateRecipeResponseSchema = z.object({
  meal_name: z.string().min(1),
  servings: z.number().int().min(1),
  ingredients: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      quantity: z.string().min(1),
      cost: z.number().nonnegative(),
      macros: macrosSchema,
    }),
  ),
  total_cost: z.number().nonnegative(),
  macros: macrosSchema,
  instructions: z.array(z.string().min(1)).default([]),
})

const suggestSubstitutionResponseSchema = z.object({
  ingredient: z.string().min(1),
  substitutions: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        quantity: z.string().min(1),
        macro_diff: macrosSchema,
        cost_diff: z.number(),
      }),
    )
    .min(2)
    .max(3),
})

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status ?? 0
    this.code = options?.code
    this.details = options?.details
  }
}

function getApiBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, '')
  }

  const hostname =
    typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : undefined
  const isLocalHostname =
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'

  if (process.env.NODE_ENV !== 'production' || isLocalHostname) {
    return fallbackApiBaseUrl
  }

  throw new ApiError('NEXT_PUBLIC_API_BASE_URL is not configured.', {
    code: 'MISSING_API_BASE_URL',
  })
}

async function requestJson<T>(
  path: string,
  body: unknown,
  responseSchema: z.ZodType<T>,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'The API request failed before reaching the server.',
      { code: 'NETWORK_ERROR' },
    )
  }

  const rawText = await response.text()
  let parsedBody: unknown = null

  if (rawText) {
    try {
      parsedBody = JSON.parse(rawText)
    } catch {
      throw new ApiError('The API returned invalid JSON.', {
        status: response.status,
        code: 'INVALID_JSON',
        details: rawText,
      })
    }
  }

  if (!response.ok) {
    const parsedError = apiErrorResponseSchema.safeParse(parsedBody)
    if (parsedError.success) {
      throw new ApiError(parsedError.data.error.message, {
        status: response.status,
        code: parsedError.data.error.code,
        details: parsedError.data.error.details,
      })
    }

    throw new ApiError(`The API request failed with status ${response.status}.`, {
      status: response.status,
      code: 'REQUEST_FAILED',
      details: parsedBody,
    })
  }

  const validatedResponse = responseSchema.safeParse(parsedBody)
  if (!validatedResponse.success) {
    throw new ApiError('The API returned an unexpected JSON shape.', {
      status: response.status,
      code: 'INVALID_RESPONSE',
      details: validatedResponse.error.flatten(),
    })
  }

  return validatedResponse.data
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

function roundMacro(value: number): number {
  return Math.round(value * 10) / 10
}

function clampMacros(macros: MacroTargets): MacroTargets {
  return {
    calories: Math.max(0, roundMacro(macros.calories)),
    protein: Math.max(0, roundMacro(macros.protein)),
    carbs: Math.max(0, roundMacro(macros.carbs)),
    fat: Math.max(0, roundMacro(macros.fat)),
  }
}

function addMacros(base: MacroTargets, delta: MacroTargets): MacroTargets {
  return clampMacros({
    calories: base.calories + delta.calories,
    protein: base.protein + delta.protein,
    carbs: base.carbs + delta.carbs,
    fat: base.fat + delta.fat,
  })
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}

export async function generateMeals(input: {
  macros: MacroTargets
  preferences: Preferences
}): Promise<Meal[]> {
  const response = await requestJson(
    '/generate-meals',
    {
      macros: input.macros,
      budget: input.preferences.budget,
      servings: input.preferences.servings,
      diet: input.preferences.diet,
      cuisine: input.preferences.cuisine,
      craving: input.preferences.craving,
    },
    generateMealsResponseSchema,
  )

  return response.meals.map((meal) => ({
    id: meal.id,
    name: meal.name,
    description: meal.description,
    macros: meal.macros,
    costPerServing: meal.cost_per_serving,
  }))
}

export async function generateRecipe(input: {
  meal: Meal
  macros: MacroTargets
  preferences: Preferences
}): Promise<Recipe> {
  const response = await requestJson(
    '/generate-recipe',
    {
      meal_name: input.meal.name,
      context: {
        macros: input.macros,
        budget: input.preferences.budget,
        servings: input.preferences.servings,
        diet: input.preferences.diet,
        cuisine: input.preferences.cuisine,
        craving: input.preferences.craving,
      },
    },
    generateRecipeResponseSchema,
  )

  return {
    meal: input.meal,
    servings: response.servings,
    ingredients: response.ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      cost: ingredient.cost,
      macros: ingredient.macros,
    })),
    totalCost: response.total_cost,
    totalMacros: response.macros,
    instructions: response.instructions ?? [],
  }
}

export async function suggestSubstitutions(input: {
  ingredient: Ingredient
  recipe: Recipe
  macros: MacroTargets
  preferences: Preferences
}): Promise<Substitution[]> {
  const response = await requestJson(
    '/suggest-substitution',
    {
      ingredient: input.ingredient.name,
      meal_context: {
        meal_name: input.recipe.meal.name,
        context: {
          macros: input.macros,
          budget: input.preferences.budget,
          servings: input.preferences.servings,
          diet: input.preferences.diet,
          cuisine: input.preferences.cuisine,
          craving: input.preferences.craving,
        },
        current_macros: input.recipe.totalMacros,
        current_total_cost: input.recipe.totalCost,
        current_ingredients: input.recipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          cost: ingredient.cost,
          macros: ingredient.macros,
        })),
        target_ingredient: {
          name: input.ingredient.name,
          quantity: input.ingredient.quantity,
          cost: input.ingredient.cost,
          macros: input.ingredient.macros,
        },
      },
    },
    suggestSubstitutionResponseSchema,
  )

  return response.substitutions.map((substitution) => ({
    id: substitution.id,
    name: substitution.name,
    quantity: substitution.quantity,
    macroDelta: substitution.macro_diff,
    costDelta: substitution.cost_diff,
  }))
}

export function applySubstitution(
  recipe: Recipe,
  ingredientId: string,
  substitution: Substitution,
): Recipe {
  const updatedIngredients = recipe.ingredients.map((ingredient) => {
    if (ingredient.id !== ingredientId) {
      return ingredient
    }

    return {
      ...ingredient,
      name: substitution.name,
      quantity: substitution.quantity,
      cost: Math.max(0, roundCurrency(ingredient.cost + substitution.costDelta)),
      macros: addMacros(ingredient.macros, substitution.macroDelta),
    }
  })

  return {
    ...recipe,
    ingredients: updatedIngredients,
    totalCost: Math.max(0, roundCurrency(recipe.totalCost + substitution.costDelta)),
    totalMacros: addMacros(recipe.totalMacros, substitution.macroDelta),
  }
}
