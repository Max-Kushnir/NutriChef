'use client'

import { MealCard } from '@/components/meal-card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Utensils } from 'lucide-react'
import type { Meal } from '@/lib/types'

interface MealGridProps {
  meals: Meal[]
  onSelectMeal: (meal: Meal) => void
  isLoading: boolean
  isSelectingRecipe?: boolean
  activeMealId?: string | null
}

export function MealGrid({
  meals,
  onSelectMeal,
  isLoading,
  isSelectingRecipe = false,
  activeMealId = null,
}: MealGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-56 rounded-xl bg-card/50 animate-pulse border border-border/30"
          />
        ))}
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Utensils className="size-5 text-muted-foreground/70" />
          </EmptyMedia>
          <EmptyTitle>No meals yet</EmptyTitle>
          <EmptyDescription>
            Configure your preferences and generate meals to get started
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onSelect={onSelectMeal}
          isLoading={activeMealId === meal.id}
          disabled={isSelectingRecipe}
        />
      ))}
    </div>
  )
}
