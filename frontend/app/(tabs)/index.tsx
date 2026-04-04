import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IngredientItem from "@/src/components/IngredientItem";
import {router} from "expo-router"

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <View className="flex-1 bg-[rgb(28,29,33)]">
        <Text className="text-4xl font-bold text-white text-center mt-4">Ready to Cook?</Text>
          <IngredientItem name={"poo"}/>
          <IngredientItem name={"poo"}/>
          <IngredientItem name={"poo"}/>
        <Pressable onPress={() => router.push("/results")}className="flex mt-auto bg-[rgb(237,84,19)] mx-10 rounded-2xl">
            <Text className="p-4 text-center text-[rgb(28,29,33)] text-xl font-bold ">Find Recipes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
