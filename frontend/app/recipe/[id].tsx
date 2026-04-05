import { use, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"
import { ChevronLeft } from "lucide-react-native";
import IngredientsOption from "@/src/components/IngredientsOption";
import EquipmentOption from "@/src/components/EquipmentOption";
import InstructionOption from "@/src/components/InstructionOption";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const tabs = ["Ingredients", "Equipment", "Instructions"]
  const [selected, setSelected] = useState(tabs[0])
  const equipment = ["skillet", "pan"]
  const ingredients = ["idk", "thing"]
  const instructions = ["sdfdfdddddddddddddddddddddddddddddddddddddddddddddddddddd", "dfs"]
  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <Pressable onPress={() => router.push("/results")} className="self-start p-2 bg-[rgb(63,69,79)] ml-4 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
      <View className="mt-5 h-[1px] bg-[rgb(59,61,69)]"></View>
      <View className="flex p-4 bg-[rgb(28,29,33)]">
        <Text className="text-4xl font-bold text-white">SDFN SDFLKJN SDFLK</Text>
      </View>
      <View className="flex flex-row">
        <Text className="ml-5 text-[rgb(167,167,167)]">⏱️ 20 min</Text>
        <View className="ml-5 px-2 bg-[rgb(37,72,66)] rounded-2xl"><Text className="text-[rgb(43,201,154)] font-bold">Easy</Text></View>
      </View>
      <View className="flex flex-row">
        {tabs.map((tab, index) => (
          <Pressable key={index} onPress={() => setSelected(tabs[index])} className={selected === tab ? "m-4 p-3 bg-[rgb(38,38,44)] rounded-t-2xl border-b-2 border-[rgb(237,84,19)]": "m-4 p-3"}>{/* remembers tab from a closure*/ }
            <Text className={selected === tab ? "text-xl text-[rgb(237,84,19)]": "text-xl text-gray-500"}>{tab}</Text>
          </Pressable>
        ))}
      </View>
      {selected === "Ingredients" && <IngredientsOption ingredients={ingredients}/>}
      {selected === "Instructions" && <InstructionOption instructions={instructions}/>}
      {selected === "Equipment" && <EquipmentOption equipment={equipment}/>}
    </SafeAreaView>
  );
}

