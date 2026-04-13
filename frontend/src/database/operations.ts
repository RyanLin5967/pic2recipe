import { database } from "./index"
import Ingredient from "./models/Ingredient"

export async function addIngredient(title: string){
    await database.write(async () => {
        await database.get<Ingredient>('ingredients').create(ing => {
            ing.title = title
        })
    })
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