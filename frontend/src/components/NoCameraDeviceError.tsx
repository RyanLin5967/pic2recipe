import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoCameraDeviceError(){
	return (
		<SafeAreaView className="flex-1 bg-[rgb(28,29,34)]">
			<View className="flex justify-center items-center text-center">
				<Text className="color-white text-center text-3xl font-bold">We could not find a camera</Text>
			</View>
		</SafeAreaView>
	)
}