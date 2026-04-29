import { Pressable } from "react-native"
import { Heart } from "lucide-react-native"
import { useState, useEffect, useRef } from "react"
import { addFavorite, removeFavorite, isFavorite } from "@/src/database/operations"
import { Recipe } from "@/src/types"

export default function FavoriteButton({ recipe }: { recipe: Recipe }) {
  const [favorited, setFavorited] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    isFavorite(recipe.id).then(result => {
      if (mounted.current) setFavorited(result)
    })
    return () => { mounted.current = false }
  }, [recipe.id])

  const toggle = async () => {
    if (favorited) {
      await removeFavorite(recipe.id)
      setFavorited(false)
    } else {
      await addFavorite(recipe)
      setFavorited(true)
    }
  }

  return (
    <Pressable onPress={toggle} className="p-2">
      <Heart
        color="rgb(237,84,19)"
        fill={favorited ? "rgb(237,84,19)" : "transparent"}
        size={24}
      />
    </Pressable>
  )
}