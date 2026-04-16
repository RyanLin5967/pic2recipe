import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCameraDevice, useCameraPermission, Camera } from 'react-native-vision-camera'
import { Linking } from 'react-native'

export default function PermissionsPage(){
  const { hasPermission, requestPermission } = useCameraPermission()

  const handlePermissions = async () => {
    const perms = await requestPermission()
    if(!perms){
      Linking.openSettings()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)] flex justify-center items-center">
      <View className="flex justify-center align-center flex-column text-center">
          <Text className="text-center text-white text-2xl font-bold ">We need access to your camera</Text>
          <Pressable onPress={handlePermissions} className=" rounded-xl p-6 bg-[rgb(237,84,19)] m-3 text-black"><Text className="text-center font-bold text-2xl">Grant access</Text></Pressable>
      </View>
    </SafeAreaView>
  )
}