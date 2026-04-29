import { Pressable, Text, View } from "react-native";
import { removeIngByTitle } from "../database/operations";
import { router } from "expo-router";

export default function MadeRecipeButton({ingredients, userIngredients}: {ingredients: string[], userIngredients: string[]}){
    const handleMadeRecipe = async () => {
        const usedIng = userIngredients.filter(
            ing => ingredients.some(ri => ri.toLowerCase().trim().includes(ing.trim().toLowerCase()))
        )
        for (let i = 0; i<usedIng.length; i++){
            await removeIngByTitle(usedIng[i])
        }
        router.push("/")
    }
    return (
        <Pressable onPress={handleMadeRecipe} className="flex rounded-3xl mx-4 p-4 mb-3 bg-[rgb(237,84,19)]"><Text className="text-center font-bold text-3xl">I Made This! 😋</Text></Pressable>
    )
}