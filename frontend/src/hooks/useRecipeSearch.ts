import { useQuery } from "@tanstack/react-query"
import { getRecipe } from "@/src/services/api"
import { Recipe } from "@/src/types/index"

export function useRecipeSearch(ingredients: string[]){
    return useQuery<Recipe[]>({
        queryFn: () => getRecipe(ingredients),
        queryKey: ["recipes", ingredients],
        enabled: ingredients.length > 0
    })
}