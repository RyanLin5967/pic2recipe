import { useQuery } from "@tanstack/react-query"
import { getById } from "@/src/services/api"

export function useRecipeDetail(id: number){
    return useQuery({
        queryFn: () => getById(id),
        queryKey: ["recipe", id]
    })
}