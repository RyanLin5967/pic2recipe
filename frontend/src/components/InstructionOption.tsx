import { View, Text } from "react-native";
import {Dot} from "lucide-react-native"
import { useState } from "react";

export default function InstructionOption({instructions}: {instructions: string[]}){
  return (
    <View>
      {instructions.map((instr, index) => (
        <View key={index} className="flex flex-row items-start px-3 py-2 bg-[rgb(59,61,69)] m-2 mx-4 rounded-3xl">
          <View className="flex-shrink-0 mt-1 mr-3 px-3 py-[5px] bg-[rgb(237,84,19)] rounded-full">
            <Text className="font-bold">{index + 1}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold mt-[6px]">{instr}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}