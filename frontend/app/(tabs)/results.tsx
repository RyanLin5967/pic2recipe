import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "@/src/components/RecipeCard";
import { router, useLocalSearchParams } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { useRecipeSearch } from '@/src/hooks/useRecipeSearch'
import LoadingScreen from "@/src/components/LoadingScreen";
import ErrorScreen from "@/src/components/ErrorScreen";

export default function Results(){
  const { ingredients: ingredientsStr } = useLocalSearchParams<{ingredients: string}>()
  const ingredients = ingredientsStr ? JSON.parse(ingredientsStr) as string[]: []
  const {data: recipes, isError, error, isPending} = useRecipeSearch(ingredients)


  if (ingredients.length == 0){
    return <ErrorScreen error={"Add some ingredients first!"}/>
  }

  if (isPending) {
    return <LoadingScreen message={"Recipes"}/>
  }

  if(isError){
    return <ErrorScreen error={error.message}/>
  }

  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <ScrollView>
        <View className="flex flex-row">
          <Pressable onPress={() => router.push("/")} className="self-start p-2 bg-[rgb(63,69,79)] ml-4 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
          <Text className="p-2 ml-4 text-white font-bold text-3xl">We Found {recipes.length} Matches</Text>
        </View>
        {recipes?.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} ingredients={ingredients}/>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}