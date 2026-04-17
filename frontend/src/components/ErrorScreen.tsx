import { View, Text } from "react-native";

export default function ErrorScreen({error}: {error: any}){
    return (
        <View className="flex-1 bg-[rgb(28,29,33)] items-center align-center justify-center">
            <Text className="text-2xl text-[rgb(237,84,19)]">Error in fetching recipe(s): {error}</Text>
        </View>
    )
}