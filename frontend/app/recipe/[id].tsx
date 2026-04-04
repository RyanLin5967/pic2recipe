import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold">Recipe #{id}</Text>
    </View>
  );
}
