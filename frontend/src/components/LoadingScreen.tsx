import { View, Text, ActivityIndicator } from "react-native";

export default function LoadingScreen({message} : {message: string}){
    return (
        <View className="flex-1 bg-[rgb(28,29,33)] items-center justify-center flex-col">
            <ActivityIndicator size="large" color="rgb(237,84,19)"/>
            <Text className="text-2xl text-[rgb(237,84,19)] mt-4">Loading {message}...</Text>
        </View>
    )
}