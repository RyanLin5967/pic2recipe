import axios from 'axios'

const BASE_URL =  "https://nonbotanic-cathleen-dramaturgically.ngrok-free.dev"

export async function getRecipe(ingredients: string[]){
    const response = await axios.post(
        `${BASE_URL}/recipe`, {
        ingredients: ingredients
    })
    return response.data
}

export async function getById(id: number){
    const response = await axios.get(`${BASE_URL}/recipe/${id}`)
    return response.data
}