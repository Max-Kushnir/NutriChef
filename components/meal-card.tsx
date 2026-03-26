'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Flame, Beef, Wheat, Droplet, DollarSign } from 'lucide-react'
import type { Meal } from '@/lib/types'

interface MealCardProps {
  meal: Meal
  onSelect: (meal: Meal) => void
  isLoading?: boolean
  disabled?: boolean
}

export function MealCard({
  meal,
  onSelect,
  isLoading = false,
  disabled = false,
}: MealCardProps) {
  return (
    <Card className="group border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{meal.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/20">
            <DollarSign className="size-3 mr-0.5" />
            {meal.costPerServing.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {meal.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Flame className="size-4 text-orange-400" />
            <span className="text-muted-foreground">{meal.macros.calories}</span>
            <span className="text-muted-foreground/60 text-xs">kcal</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Beef className="size-4 text-red-400" />
            <span className="text-muted-foreground">{meal.macros.protein}g</span>
            <span className="text-muted-foreground/60 text-xs">protein</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wheat className="size-4 text-amber-400" />
            <span className="text-muted-foreground">{meal.macros.carbs}g</span>
            <span className="text-muted-foreground/60 text-xs">carbs</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplet className="size-4 text-blue-400" />
            <span className="text-muted-foreground">{meal.macros.fat}g</span>
            <span className="text-muted-foreground/60 text-xs">fat</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={() => onSelect(meal)}
          variant="secondary"
          disabled={disabled}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              Loading Recipe...
            </span>
          ) : (
            'View Recipe'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
