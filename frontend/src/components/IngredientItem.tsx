import { View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native"

export default function IngredientItem({name} :{name: string}){
  return (
    <>
      <View className="flex bg-[rgb(59,61,69)] mx-10 mt-3 rounded-3xl flex-row"> 
        <Text className="text-white text-xl p-6">{name}</Text>
        <Pressable className="justify-center ml-auto pr-5"><Text className="text-white"><X color={"white"}></X></Text></Pressable>
      </View>
    </>
  )
}