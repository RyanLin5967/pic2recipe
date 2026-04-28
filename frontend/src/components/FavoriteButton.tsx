import { Pressable } from "react-native"
import { Heart } from "lucide-react-native"
import { useState, useEffect } from "react"
import { addFavorite, removeFavorite, isFavorite } from "../database/operations"
import { Recipe } from "../types"

export default function FavoriteButton({ recipe }: {recipe: Recipe}){
    const [favorited, setFavorited] = useState(false);
    useEffect(() => {
        isFavorite(recipe.id).then(setFavorited)
    }, [recipe.id])

    const toggle = async () => {
        if (favorited) {
            await removeFavorite(recipe.id)
        }else {
            await addFavorite(recipe)
            setFavorited(true)
        }
    }

    return (
        <Pressable onPress={toggle} className="p-2">
            <Heart color="rgb(237,84,19)" fill={favorited ? "rgb(237,84,19)": "transparent"} size={24}/>
        </Pressable>
    )
}