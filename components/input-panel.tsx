'use client'

import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel } from '@/components/ui/field'
import { Flame, Beef, Wheat, Droplet, Sparkles } from 'lucide-react'
import type { MacroTargets, Preferences } from '@/lib/types'

interface InputPanelProps {
  macros: MacroTargets
  preferences: Preferences
  onMacrosChange: (macros: MacroTargets) => void
  onPreferencesChange: (preferences: Preferences) => void
  onGenerate: () => void
  isLoading: boolean
}

const DIETS = ['Any', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean']
const CUISINES = ['Any', 'Italian', 'Mexican', 'Asian', 'Indian', 'American', 'Middle Eastern', 'Greek']
const CRAVINGS = ['Any', 'Savory', 'Sweet', 'Spicy', 'Comfort Food', 'Light & Fresh', 'Hearty']

export function InputPanel({
  macros,
  preferences,
  onMacrosChange,
  onPreferencesChange,
  onGenerate,
  isLoading,
}: InputPanelProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="size-5 text-primary" />
          Configure Your Meal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Macro Sliders */}
        <div className="space-y-5">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Macro Targets
          </h3>
          
          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Flame className="size-4 text-orange-400" />
              Calories: {macros.calories} kcal
            </FieldLabel>
            <Slider
              value={[macros.calories]}
              onValueChange={([value]) => onMacrosChange({ ...macros, calories: value })}
              min={200}
              max={2000}
              step={50}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>200</span>
              <span>2000</span>
            </div>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Beef className="size-4 text-red-400" />
              Protein: {macros.protein}g
            </FieldLabel>
            <Slider
              value={[macros.protein]}
              onValueChange={([value]) => onMacrosChange({ ...macros, protein: value })}
              min={10}
              max={150}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10g</span>
              <span>150g</span>
            </div>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Wheat className="size-4 text-amber-400" />
              Carbs: {macros.carbs}g
            </FieldLabel>
            <Slider
              value={[macros.carbs]}
              onValueChange={([value]) => onMacrosChange({ ...macros, carbs: value })}
              min={10}
              max={200}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10g</span>
              <span>200g</span>
            </div>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Droplet className="size-4 text-blue-400" />
              Fat: {macros.fat}g
            </FieldLabel>
            <Slider
              value={[macros.fat]}
              onValueChange={([value]) => onMacrosChange({ ...macros, fat: value })}
              min={5}
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5g</span>
              <span>100g</span>
            </div>
          </Field>
        </div>

        {/* Budget and Servings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Budget & Servings
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Budget per meal ($)</FieldLabel>
              <Input
                type="number"
                value={preferences.budget}
                onChange={(e) =>
                  onPreferencesChange({
                    ...preferences,
                    budget: parseFloat(e.target.value) || 0,
                  })
                }
                min={1}
                max={100}
                step={0.5}
                className="mt-1.5"
              />
            </Field>

            <Field>
              <FieldLabel>Servings</FieldLabel>
              <Input
                type="number"
                value={preferences.servings}
                onChange={(e) =>
                  onPreferencesChange({
                    ...preferences,
                    servings: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                max={12}
                className="mt-1.5"
              />
            </Field>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Preferences
          </h3>
          
          <Field>
            <FieldLabel>Diet</FieldLabel>
            <Select
              value={preferences.diet}
              onValueChange={(value) =>
                onPreferencesChange({ ...preferences, diet: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                {DIETS.map((diet) => (
                  <SelectItem key={diet} value={diet.toLowerCase()}>
                    {diet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Cuisine</FieldLabel>
            <Select
              value={preferences.cuisine}
              onValueChange={(value) =>
                onPreferencesChange({ ...preferences, cuisine: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {CUISINES.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Craving</FieldLabel>
            <Select
              value={preferences.craving}
              onValueChange={(value) =>
                onPreferencesChange({ ...preferences, craving: value })
              }
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="What are you craving?" />
              </SelectTrigger>
              <SelectContent>
                {CRAVINGS.map((craving) => (
                  <SelectItem key={craving} value={craving.toLowerCase()}>
                    {craving}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Generate Meals
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
