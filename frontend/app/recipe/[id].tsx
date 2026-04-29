import { useState } from "react";
import { View, Text, Pressable, Share } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Share2 } from "lucide-react-native";
import IngredientsOption from "@/src/components/IngredientsOption";
import EquipmentOption from "@/src/components/EquipmentOption";
import InstructionOption from "@/src/components/InstructionOption";
import { useRecipeDetail } from '@/src/hooks/useRecipeDetail'
import { handleFindRecipes } from "../(tabs)";
import LoadingScreen from "@/src/components/LoadingScreen";
import ErrorScreen from "@/src/components/ErrorScreen";
import FavoriteButton from "@/src/components/FavoriteButton";
import { Recipe } from "@/src/types";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const numId = Number(Array.isArray(id) ? id[0] : id)
  const {data: recipe, isError, error, isPending} = useRecipeDetail(numId)
  const tabs = ["Ingredients", "Equipment", "Instructions"]
  const [selected, setSelected] = useState(tabs[0])

  if (isPending) {
    return <LoadingScreen message={"Recipe"}/>
  }
  if (isError) {
    return <ErrorScreen error={error.message}/>
  }

  const equipment = recipe?.equipment ?? ["Unknown"]
  const ingredients = recipe?.ingredients
  const instructions = recipe?.directions
  const title = recipe?.title

  const recipeFav: Recipe = {
    id: numId,
    title: recipe!.title,
    ingredients: recipe!.ingredients,
    directions: recipe!.directions,
    similarity: (recipe as any)!.similarity ?? 0,
    cook_time_minutes: recipe!.cook_time_minutes,
    difficulty: recipe!.difficulty,
    equipment: recipe!.equipment,
  }

  const handleShare = async () => {
    const ingredientsList = ingredients?.join("\n• ")
    const stepList = instructions?.map((step, index) => `${index +1}. ${step}`).join("\n")

    await Share.share({
      message: `${recipe!.title}\n\n ⏱️ ${recipe!.cook_time_minutes ?? "Unknown"} min | ${recipe!.difficulty ?? "Unknown"}\n\nIngredient:\n• ${ingredientsList}\n\nInstructions:\n${stepList}\n\nShared from pic2recipe`
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <View>
        <Pressable onPress={handleFindRecipes} className="self-start p-2 bg-[rgb(63,69,79)] ml-4 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
      </View>
      <View className="mt-5 h-[1px] bg-[rgb(59,61,69)]"></View>
      <View className="flex flex-column p-4 bg-[rgb(28,29,33)]">
        <Text className="text-4xl font-bold text-white">{title}</Text>
        <View className="flex flex-row">
          <FavoriteButton recipe={recipeFav}/>
          <Pressable onPress={handleShare} className="p-2"><Share2 color="white" size={24}/></Pressable>
        </View>
      </View>
      <View className="flex flex-row">
        <Text className="ml-5 text-[rgb(167,167,167)]">⏱️ {recipe?.cook_time_minutes ?? "Unknown"} min</Text>
        <View className={recipe?.difficulty === "Easy"? "ml-5 px-2 bg-[rgb(37,72,66)] rounded-2xl": recipe?.difficulty === "Medium"? "ml-5 px-2 bg-[rgb(72,58,30)] rounded-2xl": "ml-5 px-2 bg-[rgb(72,37,37)] rounded-2xl"}><Text className={recipe?.difficulty === "Easy"? "text-[rgb(43,201,154)] font-bold": recipe?.difficulty === "Medium"? "text-[rgb(223,133,31)] font-bold": "text-[rgb(212,50,50)] font-bold"}>{recipe?.difficulty ?? "Unknown"}</Text></View>
      </View>
      <View className="flex flex-row">
        {tabs.map((tab, index) => (
          <Pressable key={index} onPress={() => setSelected(tabs[index])} className={selected === tab ? "m-3 p-3 bg-[rgb(38,38,44)] rounded-t-2xl border-b-2 border-[rgb(237,84,19)]": "m-3 p-3"}>{/* remembers tab from a closure*/ }
            <Text className={selected === tab ? "text-xl text-[rgb(237,84,19)]": "text-xl text-gray-500"}>{tab}</Text>
          </Pressable>
        ))}
      </View>
      {selected === "Ingredients" && <IngredientsOption ingredients={ingredients!}/>}
      {selected === "Instructions" && <InstructionOption instructions={instructions!}/>}
      {selected === "Equipment" && <EquipmentOption equipment={equipment!}/>}
    </SafeAreaView>
  );
}

