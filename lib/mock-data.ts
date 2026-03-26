import type { Meal, Recipe, Substitution, MacroTargets, Preferences } from './types'

// Generate unique IDs
let idCounter = 0
const generateId = () => `id-${++idCounter}-${Date.now()}`

// Mock meal generation based on preferences
export function generateMockMeals(
  macros: MacroTargets,
  preferences: Preferences
): Meal[] {
  const baseMeals: Omit<Meal, 'id'>[] = [
    {
      name: 'Grilled Chicken Salad',
      description: 'Fresh mixed greens with grilled chicken breast, cherry tomatoes, cucumber, and a light vinaigrette dressing.',
      macros: { calories: 450, protein: 42, carbs: 18, fat: 22 },
      costPerServing: 8.50,
    },
    {
      name: 'Quinoa Buddha Bowl',
      description: 'Nutrient-rich quinoa topped with roasted vegetables, chickpeas, avocado, and tahini drizzle.',
      macros: { calories: 520, protein: 18, carbs: 62, fat: 24 },
      costPerServing: 7.25,
    },
    {
      name: 'Salmon with Asparagus',
      description: 'Pan-seared salmon fillet with roasted asparagus and lemon butter sauce.',
      macros: { calories: 480, protein: 38, carbs: 12, fat: 32 },
      costPerServing: 12.00,
    },
    {
      name: 'Turkey Meatballs Pasta',
      description: 'Whole wheat pasta with homemade turkey meatballs in marinara sauce.',
      macros: { calories: 580, protein: 35, carbs: 68, fat: 18 },
      costPerServing: 9.50,
    },
    {
      name: 'Asian Stir-Fry',
      description: 'Colorful vegetable stir-fry with tofu in a savory ginger-soy sauce served over brown rice.',
      macros: { calories: 420, protein: 22, carbs: 52, fat: 16 },
      costPerServing: 6.75,
    },
    {
      name: 'Mediterranean Wrap',
      description: 'Whole wheat wrap filled with falafel, hummus, fresh vegetables, and tzatziki sauce.',
      macros: { calories: 490, protein: 16, carbs: 58, fat: 22 },
      costPerServing: 7.00,
    },
    {
      name: 'Beef Tacos',
      description: 'Seasoned ground beef in corn tortillas with fresh salsa, guacamole, and cheese.',
      macros: { calories: 550, protein: 28, carbs: 42, fat: 30 },
      costPerServing: 8.25,
    },
    {
      name: 'Shrimp Fried Rice',
      description: 'Classic fried rice with jumbo shrimp, scrambled eggs, and mixed vegetables.',
      macros: { calories: 510, protein: 26, carbs: 58, fat: 20 },
      costPerServing: 9.00,
    },
  ]

  // Filter and adjust based on preferences
  let filteredMeals = [...baseMeals]

  if (preferences.diet === 'vegetarian') {
    filteredMeals = filteredMeals.filter(
      m => !m.name.toLowerCase().includes('chicken') &&
           !m.name.toLowerCase().includes('salmon') &&
           !m.name.toLowerCase().includes('turkey') &&
           !m.name.toLowerCase().includes('beef') &&
           !m.name.toLowerCase().includes('shrimp')
    )
  }

  if (preferences.cuisine !== 'any') {
    // Adjust based on cuisine preference (simplified)
    const cuisineMapping: Record<string, string[]> = {
      italian: ['pasta'],
      mexican: ['tacos'],
      asian: ['stir-fry', 'fried rice'],
      mediterranean: ['wrap', 'salad'],
    }
    const keywords = cuisineMapping[preferences.cuisine] || []
    if (keywords.length > 0) {
      const cuisineFiltered = filteredMeals.filter(m =>
        keywords.some(k => m.name.toLowerCase().includes(k))
      )
      if (cuisineFiltered.length > 0) {
        filteredMeals = [...cuisineFiltered, ...filteredMeals.filter(m => !cuisineFiltered.includes(m))]
      }
    }
  }

  // Adjust macros slightly to match targets
  return filteredMeals.slice(0, 6).map(meal => ({
    ...meal,
    id: generateId(),
    macros: {
      calories: Math.round(macros.calories * (0.85 + Math.random() * 0.3)),
      protein: Math.round(macros.protein * (0.8 + Math.random() * 0.4)),
      carbs: Math.round(macros.carbs * (0.8 + Math.random() * 0.4)),
      fat: Math.round(macros.fat * (0.8 + Math.random() * 0.4)),
    },
    costPerServing: Math.min(
      preferences.budget,
      meal.costPerServing * (0.8 + Math.random() * 0.4)
    ),
  }))
}

// Generate recipe details for a meal
export function generateMockRecipe(meal: Meal): Recipe {
  const ingredientSets: Record<string, Array<{ name: string; quantity: string; cost: number; macros: MacroTargets }>> = {
    'Grilled Chicken Salad': [
      { name: 'Chicken Breast', quantity: '6 oz', cost: 3.50, macros: { calories: 280, protein: 35, carbs: 0, fat: 12 } },
      { name: 'Mixed Greens', quantity: '3 cups', cost: 1.50, macros: { calories: 25, protein: 2, carbs: 4, fat: 0 } },
      { name: 'Cherry Tomatoes', quantity: '1 cup', cost: 1.25, macros: { calories: 30, protein: 1, carbs: 6, fat: 0 } },
      { name: 'Cucumber', quantity: '1/2 medium', cost: 0.75, macros: { calories: 15, protein: 1, carbs: 3, fat: 0 } },
      { name: 'Olive Oil', quantity: '2 tbsp', cost: 0.50, macros: { calories: 120, protein: 0, carbs: 0, fat: 14 } },
      { name: 'Balsamic Vinegar', quantity: '1 tbsp', cost: 0.25, macros: { calories: 15, protein: 0, carbs: 3, fat: 0 } },
    ],
    'Quinoa Buddha Bowl': [
      { name: 'Quinoa', quantity: '1 cup cooked', cost: 1.00, macros: { calories: 220, protein: 8, carbs: 40, fat: 4 } },
      { name: 'Chickpeas', quantity: '1/2 cup', cost: 0.75, macros: { calories: 135, protein: 7, carbs: 22, fat: 2 } },
      { name: 'Avocado', quantity: '1/2 medium', cost: 1.50, macros: { calories: 120, protein: 1, carbs: 6, fat: 11 } },
      { name: 'Roasted Sweet Potato', quantity: '1 cup', cost: 1.00, macros: { calories: 115, protein: 2, carbs: 27, fat: 0 } },
      { name: 'Tahini', quantity: '2 tbsp', cost: 0.75, macros: { calories: 90, protein: 3, carbs: 3, fat: 8 } },
      { name: 'Mixed Vegetables', quantity: '1 cup', cost: 1.25, macros: { calories: 50, protein: 2, carbs: 10, fat: 0 } },
    ],
    default: [
      { name: 'Main Protein', quantity: '6 oz', cost: 4.00, macros: { calories: 250, protein: 30, carbs: 5, fat: 12 } },
      { name: 'Vegetables', quantity: '2 cups', cost: 2.00, macros: { calories: 80, protein: 4, carbs: 16, fat: 1 } },
      { name: 'Carbohydrate', quantity: '1 cup', cost: 1.00, macros: { calories: 200, protein: 5, carbs: 40, fat: 2 } },
      { name: 'Cooking Oil', quantity: '1 tbsp', cost: 0.25, macros: { calories: 120, protein: 0, carbs: 0, fat: 14 } },
      { name: 'Seasonings', quantity: 'to taste', cost: 0.50, macros: { calories: 10, protein: 0, carbs: 2, fat: 0 } },
    ],
  }

  const instructionSets: Record<string, string[]> = {
    'Grilled Chicken Salad': [
      'Season the chicken breast with salt, pepper, and your favorite herbs.',
      'Grill the chicken over medium-high heat for 6-7 minutes per side until fully cooked.',
      'Let the chicken rest for 5 minutes, then slice into strips.',
      'Wash and dry the mixed greens, halve the cherry tomatoes, and slice the cucumber.',
      'Arrange the greens on a plate and top with vegetables and chicken.',
      'Drizzle with olive oil and balsamic vinegar. Serve immediately.',
    ],
    'Quinoa Buddha Bowl': [
      'Cook quinoa according to package directions and let cool slightly.',
      'Roast the sweet potato cubes at 400°F for 25 minutes until tender.',
      'Drain and rinse the chickpeas, then season and roast for 15 minutes.',
      'Slice the avocado and prepare any other vegetables.',
      'Arrange quinoa in a bowl and top with all ingredients in sections.',
      'Drizzle with tahini and serve.',
    ],
    default: [
      'Prepare all ingredients by washing and cutting as needed.',
      'Heat oil in a large pan over medium-high heat.',
      'Cook the protein until done, then set aside.',
      'Sauté vegetables until tender-crisp.',
      'Combine all components and season to taste.',
      'Plate and serve hot.',
    ],
  }

  const ingredients = (ingredientSets[meal.name] || ingredientSets.default).map(ing => ({
    ...ing,
    id: generateId(),
  }))

  const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0)
  const totalMacros = ingredients.reduce(
    (sum, ing) => ({
      calories: sum.calories + ing.macros.calories,
      protein: sum.protein + ing.macros.protein,
      carbs: sum.carbs + ing.macros.carbs,
      fat: sum.fat + ing.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return {
    meal,
    servings: 2,
    ingredients,
    totalCost,
    totalMacros,
    instructions: instructionSets[meal.name] || instructionSets.default,
  }
}

// Generate substitutions for an ingredient
export function generateMockSubstitutions(ingredientName: string): Substitution[] {
  const substitutionMap: Record<string, Substitution[]> = {
    'Chicken Breast': [
      {
        id: generateId(),
        name: 'Turkey Breast',
        quantity: '6 oz',
        macroDelta: { calories: -20, protein: 2, carbs: 0, fat: -2 },
        costDelta: 0.50,
      },
      {
        id: generateId(),
        name: 'Tofu',
        quantity: '8 oz',
        macroDelta: { calories: -100, protein: -15, carbs: 4, fat: -4 },
        costDelta: -1.50,
      },
      {
        id: generateId(),
        name: 'Tempeh',
        quantity: '6 oz',
        macroDelta: { calories: -50, protein: -5, carbs: 8, fat: 2 },
        costDelta: -0.50,
      },
    ],
    'Quinoa': [
      {
        id: generateId(),
        name: 'Brown Rice',
        quantity: '1 cup cooked',
        macroDelta: { calories: 0, protein: -2, carbs: 5, fat: 0 },
        costDelta: -0.50,
      },
      {
        id: generateId(),
        name: 'Cauliflower Rice',
        quantity: '1.5 cups',
        macroDelta: { calories: -180, protein: -5, carbs: -35, fat: -3 },
        costDelta: 0.25,
      },
    ],
    'Avocado': [
      {
        id: generateId(),
        name: 'Hummus',
        quantity: '3 tbsp',
        macroDelta: { calories: -30, protein: 2, carbs: 4, fat: -6 },
        costDelta: -0.75,
      },
      {
        id: generateId(),
        name: 'Greek Yogurt',
        quantity: '1/4 cup',
        macroDelta: { calories: -80, protein: 5, carbs: 2, fat: -10 },
        costDelta: -0.50,
      },
    ],
    default: [
      {
        id: generateId(),
        name: 'Alternative Option 1',
        quantity: 'same quantity',
        macroDelta: { calories: -20, protein: 0, carbs: 5, fat: -2 },
        costDelta: -0.25,
      },
      {
        id: generateId(),
        name: 'Alternative Option 2',
        quantity: 'adjusted quantity',
        macroDelta: { calories: 30, protein: 2, carbs: -5, fat: 3 },
        costDelta: 0.50,
      },
    ],
  }

  return substitutionMap[ingredientName] || substitutionMap.default
}
