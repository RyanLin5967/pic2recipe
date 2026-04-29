import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class Favorite extends Model {
    static table= "favorites"

    @field("recipe_id") recipeId!: number
    @field("title") title!: string
    @field("ingredients_json") ingredientsJson!: string
    @field("directions_json") directionsJson!: string
    @field("similarity") similarity!: number
    @field("cook_time_minutes") cookTimeMinutes!: any
    @field("difficulty") difficulty!: string | null
    @field("equipment_json") equipmentJson!: string | null
    @readonly @date("create_at") createdAt!: Date
}