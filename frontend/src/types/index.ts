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

export type Detection = {
  name: string
  confidence: number
  x1: number
  y1: number
  x2: number
  y2: number
}
export type VisionDetection = {
  label: string
  box_2d: [number, number, number, number]
}