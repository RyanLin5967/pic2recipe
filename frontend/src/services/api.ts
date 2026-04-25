import axios from 'axios'
import { Recipe } from '@/src/types/index'
const BASE_URL =  "https://api.ryanlin.dev"

export async function getRecipe(ingredients: string[]){
    const response = await axios.post<Recipe[]>(
        `${BASE_URL}/recipe`, {
        ingredients: ingredients
    })
    return response.data
}

export async function getById(id: number){
    const response = await axios.get<Recipe>(`${BASE_URL}/recipe/${id}`)
    return response.data
}