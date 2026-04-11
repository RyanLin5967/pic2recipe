export interface Recipe {
  id: number
  title: string
  ingredients: string[]
  directions: string[]
  similarity: number
  cook_time_minutes: number
  difficulty: string
  equipment: string[]
}