import { View, Text } from "react-native";
import {Dot} from "lucide-react-native"
export default function EquipmentOption({equipment}: {equipment: string[]}){
  return (
    <View>
      {equipment.map((equip, index) => (
        <View key={index} className="flex flex-row px-3 py-2 bg-[rgb(59,61,69)] m-2 mx-4 rounded-3xl">
          <View className=""><Dot color={"[rgb(237,84,19)]"} size={40}></Dot></View>
          <Text className="mt-2 text-white text-xl font-bold">{equip}</Text>
        </View>
      ))}
    </View>
  )
}