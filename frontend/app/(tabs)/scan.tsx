import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"
import { ChevronLeft } from "lucide-react-native"


export default function ScanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <View className="flex bg-[rgb(28,29,33)] flex-row">
        <Pressable onPress={() => router.push("/")} className="p-2 bg-[rgb(63,69,79)] ml-2 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
        <View className="absolute left-0 right-0 items-center">
          <Text className="flex-1 text-white font-bold mt-2 text-center p-2 px-4 rounded-2xl bg-[rgb(63,69,79)]">3 Items Scanned</Text>
        </View>
        <View className="p-2 ml-2 opacity-0">
          <ChevronLeft color={"white"} />
        </View>
      </View>
      <Text className="flex mt-auto text-center text-white">Point camera at ingredients</Text>
    </SafeAreaView>
  );
}