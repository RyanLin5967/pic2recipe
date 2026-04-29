import { database } from "./index"
import Ingredient from "./models/Ingredient"
import { Recipe } from "../types"
import Favorite from "./models/Favorite"

export async function addIngredient(title: string){
    if (await isExistingIngredient(title)){
        throw new Error(`You already have ${title} added!`)
    } else {
        await database.write(async () => {
            await database.get<Ingredient>('ingredients').create(ing => {
                ing.title = title
            })
        })
    }
}

export async function removeIngredient(id: string){
    await database.write(async () => {
        const ingredient = await database.get<Ingredient>('ingredients').find(id)
        await ingredient.destroyPermanently()
    })
}

export async function getIngredients(){
    const allIngredients = await database.get<Ingredient>('ingredients').query().fetch()
    return allIngredients.map(ing => ing.title)
}

async function isExistingIngredient(ingredient: string): Promise<boolean>{
    const allIng = await getIngredients()
    return allIng.some(ing => ing.toLowerCase().trim() === ingredient.toLowerCase().trim())
}

export async function removeIngByTitle(title: string){
    const all = await database.get<Ingredient>('ingredients').query().fetch()
    const match = all.find(ing => ing.title.toLowerCase().trim() === title.toLowerCase().trim())
    if(match){
        await database.write(async () => {
            await match.destroyPermanently()
        })
    }
}
export async function addFavorite(recipe: Recipe){
    if (await isFavorite(recipe.id)) return
    await database.write(async () => {
        await database.get<Favorite>("favorites").create(fav => {
            fav.recipeId = recipe.id
            fav.title = recipe.title
            fav.ingredientsJson = JSON.stringify(recipe.ingredients)
            fav.directionsJson = JSON.stringify(recipe.directions)
            fav.similarity = recipe.similarity
            fav.cookTimeMinutes = recipe.cook_time_minutes
            fav.difficulty = recipe.difficulty
            fav.equipmentJson = JSON.stringify(recipe.equipment)
        })
    })
}

export async function removeFavorite(recipeId: number){
    const all = await database.get<Favorite>("favorites").query().fetch()
    const fav = all.find(f => f.recipeId === recipeId)
    if (fav) {
        await database.write(async () => {
            await fav.destroyPermanently()
        })
    }
}

export async function isFavorite(recipeId: number){
    const all = await database.get<Favorite>("favorites").query().fetch()
    return all.some(f => f.recipeId === recipeId)
}