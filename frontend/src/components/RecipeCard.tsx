import { View, Text, Pressable } from "react-native"
import { router } from "expo-router"
import {Recipe} from "@/src/types/index"
export default function RecipeCard({recipe, ingredients}: {recipe: Recipe, ingredients: string[]}){
  function usesWhatIngredients() {
    return "Uses your: " + ingredients
      .filter(ing => 
        recipe.ingredients.some(ri => ri.trim().toLowerCase().includes(ing.trim().toLowerCase()))
      )
      .join(", ")
  }
  return (
    <View className="flex bg-[rgb(42,44,50)] m-2 mx-8 border border-[rgb(57,59,67)] rounded-3xl">
      <Text className="text-white font-bold text-2xl pl-5 pt-4">{recipe.title}</Text>
      <View className="flex flex-row">
        <View className="ml-5 mt-2 p-1 px-2 bg-[rgb(237,84,19)] rounded-2xl"><Text className="font-bold">{Math.round((recipe.similarity)*100)}% Match</Text></View>
        <View className={recipe.difficulty === "Easy"? "ml-2 mt-2 p-1 px-2 bg-[rgb(37,72,66)] rounded-2xl": recipe.difficulty === "Medium"? "ml-2 mt-2 p-1 px-2 bg-[rgb(72,58,30)] rounded-2xl": "ml-2 mt-2 p-1 px-2 bg-[rgb(72,37,37)] rounded-2xl"}><Text className={recipe.difficulty === "Easy"? "text-[rgb(43,201,154)] font-bold": recipe.difficulty === "Medium"? "text-[rgb(223,133,31)] font-bold": "text-[rgb(212,50,50)] font-bold"}>{recipe.difficulty ?? "Unknown"}</Text></View>
      </View>
      <Text className="ml-5 my-4 text-[rgb(167,167,167)]">{usesWhatIngredients()}</Text>
      <View className="flex flex-row">
        <Text className="ml-5 mt-3 mb-5 text-[rgb(167,167,167)]">⏱️ {recipe.cook_time_minutes ?? "Unknown"} min</Text>
        <Pressable onPress={() => router.push(`/recipe/${recipe.id}`)}className="p-2 px-4 m-2 ml-auto mr-3 bg-[rgb(28,29,33)] border border-[rgb(237,84,19)] rounded-3xl"><Text className="text-[rgb(237,84,19)] font-bold">View Recipe</Text></Pressable>
      </View>
    </View>
  )
}