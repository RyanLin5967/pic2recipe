import { useQuery } from "@tanstack/react-query"
import { getById } from "@/src/services/api"
import { Recipe } from '@/src/types/index'

export function useRecipeDetail(id: number){
    return useQuery<Recipe>({
        queryFn: () => getById(id),
        queryKey: ["recipe", id]
    })
}