'use client'

import { useCallback, useState } from 'react'
import { InputPanel } from '@/components/input-panel'
import { MealGrid } from '@/components/meal-grid'
import { RecipeView } from '@/components/recipe-view'
import { SubstitutionModal } from '@/components/substitution-modal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ChefHat, Sparkles, TriangleAlert } from 'lucide-react'
import {
  applySubstitution,
  generateMeals,
  generateRecipe,
  getErrorMessage,
  suggestSubstitutions,
} from '@/lib/api'
import type {
  Ingredient,
  MacroTargets,
  Meal,
  Preferences,
  Recipe,
  Substitution,
} from '@/lib/types'

export default function Home() {
  const [macros, setMacros] = useState<MacroTargets>({
    calories: 600,
    protein: 40,
    carbs: 60,
    fat: 25,
  })

  const [preferences, setPreferences] = useState<Preferences>({
    budget: 15,
    servings: 2,
    diet: 'any',
    cuisine: 'any',
    craving: 'any',
  })

  const [meals, setMeals] = useState<Meal[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)
  const [activeMealId, setActiveMealId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [swapModalOpen, setSwapModalOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [substitutions, setSubstitutions] = useState<Substitution[]>([])
  const [isLoadingSubstitutions, setIsLoadingSubstitutions] = useState(false)
  const [substitutionError, setSubstitutionError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setErrorMessage(null)
    setMeals([])
    setSelectedRecipe(null)

    try {
      const generatedMeals = await generateMeals({ macros, preferences })
      setMeals(generatedMeals)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to generate meals right now.'))
    } finally {
      setIsGenerating(false)
    }
  }, [macros, preferences])

  const handleSelectMeal = useCallback(
    async (meal: Meal) => {
      setIsLoadingRecipe(true)
      setActiveMealId(meal.id)
      setErrorMessage(null)

      try {
        const recipe = await generateRecipe({ meal, macros, preferences })
        setSelectedRecipe(recipe)
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Unable to load that recipe right now.'))
      } finally {
        setIsLoadingRecipe(false)
        setActiveMealId(null)
      }
    },
    [macros, preferences],
  )

  const handleBack = useCallback(() => {
    setSelectedRecipe(null)
  }, [])

  const handleSwapModalChange = useCallback((open: boolean) => {
    setSwapModalOpen(open)

    if (!open) {
      setSelectedIngredient(null)
      setSubstitutions([])
      setSubstitutionError(null)
      setIsLoadingSubstitutions(false)
    }
  }, [])

  const handleSwapIngredient = useCallback(
    async (ingredient: Ingredient) => {
      if (!selectedRecipe) return

      setSelectedIngredient(ingredient)
      setSubstitutions([])
      setSubstitutionError(null)
      setSwapModalOpen(true)
      setIsLoadingSubstitutions(true)

      try {
        const nextSubstitutions = await suggestSubstitutions({
          ingredient,
          recipe: selectedRecipe,
          macros,
          preferences,
        })
        setSubstitutions(nextSubstitutions)
      } catch (error) {
        setSubstitutionError(
          getErrorMessage(error, 'Unable to load substitutions for this ingredient.'),
        )
      } finally {
        setIsLoadingSubstitutions(false)
      }
    },
    [macros, preferences, selectedRecipe],
  )

  const handleSelectSubstitution = useCallback(
    (substitution: Substitution) => {
      if (!selectedRecipe || !selectedIngredient) return

      setSelectedRecipe(applySubstitution(selectedRecipe, selectedIngredient.id, substitution))
      handleSwapModalChange(false)
    },
    [handleSwapModalChange, selectedIngredient, selectedRecipe],
  )

  const showInlineError = errorMessage && !selectedRecipe

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
              <ChefHat className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">NutriChef AI</h1>
              <p className="text-xs text-muted-foreground">Smart Recipe Generator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <InputPanel
                macros={macros}
                preferences={preferences}
                onMacrosChange={setMacros}
                onPreferencesChange={setPreferences}
                onGenerate={handleGenerate}
                isLoading={isGenerating}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {showInlineError ? (
              <Alert variant="destructive" className="mb-6 border-destructive/30">
                <TriangleAlert className="size-4" />
                <AlertTitle>Request failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {selectedRecipe ? (
              <RecipeView
                recipe={selectedRecipe}
                onBack={handleBack}
                onSwapIngredient={handleSwapIngredient}
              />
            ) : (
              <div className="space-y-6">
                {meals.length > 0 && !isGenerating && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <h2 className="text-lg font-medium">{meals.length} meals generated for you</h2>
                  </div>
                )}

                <MealGrid
                  meals={meals}
                  onSelectMeal={handleSelectMeal}
                  isLoading={isGenerating}
                  isSelectingRecipe={isLoadingRecipe}
                  activeMealId={activeMealId}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <SubstitutionModal
        open={swapModalOpen}
        onOpenChange={handleSwapModalChange}
        ingredient={selectedIngredient}
        substitutions={substitutions}
        onSelectSubstitution={handleSelectSubstitution}
        isLoading={isLoadingSubstitutions}
        errorMessage={substitutionError}
      />
    </div>
  )
}
