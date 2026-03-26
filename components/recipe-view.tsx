'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Flame,
  Beef,
  Wheat,
  Droplet,
  DollarSign,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react'
import type { Recipe, Ingredient } from '@/lib/types'

interface RecipeViewProps {
  recipe: Recipe
  onBack: () => void
  onSwapIngredient: (ingredient: Ingredient) => void
}

export function RecipeView({ recipe, onBack, onSwapIngredient }: RecipeViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{recipe.meal.name}</h2>
          <p className="text-muted-foreground mt-1">{recipe.meal.description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Makes {recipe.servings} serving{recipe.servings === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-border/50 bg-card/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Flame className="size-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{recipe.totalMacros.calories}</p>
              <p className="text-xs text-muted-foreground">calories</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Beef className="size-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{recipe.totalMacros.protein}g</p>
              <p className="text-xs text-muted-foreground">protein</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Wheat className="size-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{recipe.totalMacros.carbs}g</p>
              <p className="text-xs text-muted-foreground">carbs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Droplet className="size-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{recipe.totalMacros.fat}g</p>
              <p className="text-xs text-muted-foreground">fat</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingredients */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <DollarSign className="size-3 mr-0.5" />
              {recipe.totalCost.toFixed(2)} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={ingredient.id}>
                {index > 0 && <Separator className="my-2 bg-border/50" />}
                <div className="flex items-center justify-between py-2 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {ingredient.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="size-3 text-orange-400" />
                        {ingredient.macros.calories}
                      </span>
                      <span className="flex items-center gap-1">
                        <Beef className="size-3 text-red-400" />
                        {ingredient.macros.protein}g
                      </span>
                      <span className="flex items-center gap-1">
                        <Wheat className="size-3 text-amber-400" />
                        {ingredient.macros.carbs}g
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplet className="size-3 text-blue-400" />
                        {ingredient.macros.fat}g
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      ${ingredient.cost.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSwapIngredient(ingredient)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                    >
                      <RefreshCw className="size-4 mr-1" />
                      Swap
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      {recipe.instructions && recipe.instructions.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 size-7 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
