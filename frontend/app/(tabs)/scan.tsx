import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { useCameraDevice, useCameraPermission, Camera } from 'react-native-vision-camera'
import NoCameraDeviceError from "@/src/components/NoCameraDeviceError";
import PermissionsPage from "@/src/components/PermissionsPage";
import { StyleSheet } from "react-native";

export default function ScanScreen() {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')

  if (!hasPermission) return <PermissionsPage />
  if (device == null) return <NoCameraDeviceError />
  
  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <Camera device={device} isActive={true} style={StyleSheet.absoluteFill} />
        <View className="flex flex-row ">
          <Pressable onPress={() => router.push("/")} className="p-2 bg-[rgb(63,69,79)] ml-2 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
          <View className="absolute left-0 right-0 items-center">
            <Text className="flex-1 text-white font-bold text-center p-2.5 px-4 rounded-2xl bg-[rgb(63,69,79)]">3 Items Scanned</Text>
          </View>
          <View className="p-2 ml-2 opacity-0">
            <ChevronLeft color={"white"} />
          </View>
        </View>
        <Text className="flex mt-auto text-center text-white">Point camera at ingredients</Text>
    </SafeAreaView>
  );
}