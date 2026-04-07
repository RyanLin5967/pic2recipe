import { useQuery } from "@tanstack/react-query"
import { getRecipe } from "@/src/services/api"

export function useRecipeSearch(ingredients: string[]){
    return useQuery({
        queryFn: () => getRecipe(ingredients),
        queryKey: ["recipes", ingredients],
        enabled: ingredients.length > 0
    })
}