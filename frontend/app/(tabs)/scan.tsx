import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"
import { ChevronLeft, Circle } from "lucide-react-native"
import { useCameraDevice, useCameraPermission, Camera, useFrameProcessor } from 'react-native-vision-camera'
import NoCameraDeviceError from "@/src/components/NoCameraDeviceError";
import PermissionsPage from "@/src/components/PermissionsPage";
import { StyleSheet } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useEffect, useCallback, useRef } from "react"
import { useResizePlugin } from "vision-camera-resize-plugin";
import { useSharedValue } from "react-native-reanimated";
import { Worklets } from "react-native-worklets-core";
import { CLASS_NAMES } from "@/src/constants/classNames";
import LoadingScreen from "@/src/components/LoadingScreen";
import { useIngredientDetection } from "@/src/hooks/useIngredientDetection";

export default function ScanScreen() {
  const { hasPermission } = useCameraPermission()
  const device = useCameraDevice("back")
  const cameraRef = useRef<Camera>(null)
  const { modelState, frameProcessor, triggerCapture, latestDetections } = useIngredientDetection()

  const handleCapture = async () => {
    if (!cameraRef.current || modelState !== "loaded") {
      return
    }
    latestDetections.current = []
    triggerCapture()
    const photo = await cameraRef.current.takePhoto()
    const maxWait = 5000
    const pollInterval = 50
    let waited = 0
    while (latestDetections.current.length === 0 && waited < maxWait) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
      waited += pollInterval
    }

    router.push({
      pathname: "/confirm",
      params: {
        photoPath: photo.path,
        photoWidth: String(photo.width),
        photoHeight: String(photo.height),
        detections: JSON.stringify(latestDetections.current),
      },
    })
  }
  
  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;
  if (modelState !== "loaded") return <LoadingScreen message={"Model"}/>;
  
  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <Camera device={device} isActive={true} style={StyleSheet.absoluteFill} frameProcessor={frameProcessor} ref={cameraRef} photo={true}/>
        <View className="flex flex-row">
          <Pressable onPress={() => router.push("/")} className="p-2 bg-[rgb(63,69,79)] ml-2 rounded-2xl"><ChevronLeft color={"white"}/></Pressable>
          <View className="absolute left-0 right-0 items-center">
            <Text className="flex-1 text-white font-bold text-center p-2.5 px-4 rounded-2xl bg-[rgb(63,69,79)]">3 Items Scanned</Text>
          </View>
          <View className="p-2 ml-2 opacity-0">
            <ChevronLeft color={"white"} />
          </View>
        </View>
        <Text className="flex mt-auto text-center text-white">Point camera at ingredients</Text>
        <Pressable onPress={handleCapture} className="absolute bottom-10 self-center bg-white rounded-full p-2"><Circle color="rgb(237,84,19)" fill="rgb(237,84,19)" size={60}></Circle></Pressable>
    </SafeAreaView>
  );
}