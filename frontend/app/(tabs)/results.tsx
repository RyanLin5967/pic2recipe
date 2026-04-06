import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Recipe} from "@/src/types/index"
import RecipeCard from "@/src/components/RecipeCard";
import {router} from "expo-router"
import {ChevronLeft} from "lucide-react-native"

export default function Results(){
  const recipe: Recipe = {
    id: 69,
    title: "Garlic Button Chicken",
    ingredients: ["a", "b", "c"],
    directions: ["d", "e", "f"],
    similarity: 0.99
  }
  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <ScrollView>
        <View className="flex flex-row">
          <Pressable onPress={() => router.push("/")} className="self-start p-2 bg-[rgb(63,69,79)] ml-4 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
          <Text className="p-2 ml-4 text-white font-bold text-3xl">We Found 5 Matches</Text>
        </View>
        <RecipeCard recipe={recipe}></RecipeCard>
        <RecipeCard recipe={recipe}></RecipeCard>
        <RecipeCard recipe={recipe}></RecipeCard>
        <RecipeCard recipe={recipe}></RecipeCard>
        <RecipeCard recipe={recipe}></RecipeCard>
      </ScrollView>
    </SafeAreaView>
  )
}