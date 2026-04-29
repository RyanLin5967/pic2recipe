import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/src/database/index"
import Favorite from "../database/models/Favorite";
import RecipeCard from "./RecipeCard";
import { View, Text } from "react-native"
import { Recipe } from "@/src/types"
import Ingredient from "../database/models/Ingredient";

function FavoritesList({ favorites, ingredients }: {favorites: Favorite[], ingredients: Ingredient[]}){
    if (favorites.length === 0){
        return (
            <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-gray-500 text-xl">Add some favorites!</Text>
            </View>
        )
    }
    const ingredientNames = ingredients.map(ing => ing.title)
    return (
        <View>
            {favorites.map((fav) => {
                const recipe: Recipe = {
                    id: fav.recipeId,
                    title: fav.title,
                    ingredients: JSON.parse(fav.ingredientsJson),
                    directions: JSON.parse(fav.directionsJson),
                    similarity: fav.similarity,
                    cook_time_minutes: fav.cookTimeMinutes || null,
                    difficulty: fav.difficulty ?? "Unknown",
                    equipment: fav.equipmentJson ? JSON.parse(fav.equipmentJson): []
                }
                return <RecipeCard key={fav.id} recipe={recipe} ingredients={ingredientNames}/>
            })}
        </View>
    )
}

const enhance = withObservables([], () => ({
    favorites: database.get<Favorite>("favorites").query().observe(),
    ingredients: database.get<Ingredient>('ingredients').query().observe()
})) 

export default enhance(FavoritesList)