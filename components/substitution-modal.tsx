'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { Ingredient, Substitution } from '@/lib/types'

interface SubstitutionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingredient: Ingredient | null
  substitutions: Substitution[]
  onSelectSubstitution: (substitution: Substitution) => void
  isLoading: boolean
  errorMessage?: string | null
}

function MacroDelta({ value, label }: { value: number; label: string }) {
  if (value === 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="size-3" />
        {label}
      </span>
    )
  }
  
  const isPositive = value > 0
  return (
    <span
      className={`flex items-center gap-1 text-xs ${
        isPositive ? 'text-red-400' : 'text-primary'
      }`}
    >
      {isPositive ? (
        <TrendingUp className="size-3" />
      ) : (
        <TrendingDown className="size-3" />
      )}
      {isPositive ? '+' : ''}{value} {label}
    </span>
  )
}

export function SubstitutionModal({
  open,
  onOpenChange,
  ingredient,
  substitutions,
  onSelectSubstitution,
  isLoading,
  errorMessage = null,
}: SubstitutionModalProps) {
  if (!ingredient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Swap Ingredient</DialogTitle>
          <DialogDescription>
            Replace <span className="font-medium text-foreground">{ingredient.name}</span> with
            an alternative
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-secondary/50 animate-pulse"
              />
            ))
          ) : errorMessage ? null : substitutions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No substitutions available for this ingredient
            </p>
          ) : (
            substitutions.map((sub) => (
              <Card
                key={sub.id}
                className="border-border/50 bg-card/60 cursor-pointer transition-all hover:border-primary/50 hover:bg-card"
                onClick={() => onSelectSubstitution(sub)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{sub.name}</span>
                        <ArrowRight className="size-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {sub.quantity}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        <MacroDelta value={sub.macroDelta.calories} label="cal" />
                        <MacroDelta value={sub.macroDelta.protein} label="protein" />
                        <MacroDelta value={sub.macroDelta.carbs} label="carbs" />
                        <MacroDelta value={sub.macroDelta.fat} label="fat" />
                      </div>
                    </div>
                    
                    <Badge
                      variant={sub.costDelta <= 0 ? 'default' : 'secondary'}
                      className={
                        sub.costDelta <= 0
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-secondary text-secondary-foreground'
                      }
                    >
                      {sub.costDelta <= 0 ? '' : '+'}${sub.costDelta.toFixed(2)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
