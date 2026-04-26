import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { ChevronLeft, Circle } from "lucide-react-native"
import { useCameraDevice, useCameraPermission, Camera } from "react-native-vision-camera"
import { useRef, useState } from "react"
import NoCameraDeviceError from "@/src/components/NoCameraDeviceError"
import PermissionsPage from "@/src/components/PermissionsPage"
import { identifyIngredients } from "@/src/services/vision"
import { File } from "expo-file-system/next"

export default function ScanScreen() {
  const { hasPermission } = useCameraPermission()
  const device = useCameraDevice("back")
  const cameraRef = useRef<Camera>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCapture = async () => {
  if (!cameraRef.current || isProcessing) return
  setIsProcessing(true)

  try {
    const photo = await cameraRef.current.takePhoto()

    const file = new File(`file://${photo.path}`)
    const base64 = await file.base64()

    const detections = await identifyIngredients(base64)

    router.push({
      pathname: "/confirm",
      params: {
        photoPath: photo.path,
        photoWidth: String(photo.width),
        photoHeight: String(photo.height),
        detections: JSON.stringify(detections),
      },
    })
    } catch (err) {
      console.error("Capture failed:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!hasPermission) return <PermissionsPage />
  if (device == null) return <NoCameraDeviceError />

  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <Camera
        ref={cameraRef}
        device={device}
        isActive={true}
        style={StyleSheet.absoluteFill}
        photo={true}
      />
        <View className="flex flex-row">
          <Pressable
            onPress={() => router.push("/")}
            className="p-2 bg-[rgb(63,69,79)] ml-2 rounded-2xl"
          >
            <ChevronLeft color={"white"} />
          </Pressable>
          <View className="flex bg-[rgb(63,69,79)] items-center justify-center text-center ml-10 p-3 rounded-2xl">
            <Text className="text-white text-center font-bold">Scan physical ingredients or a receipt</Text>
          </View>
        </View>
      {isProcessing && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <ActivityIndicator size="large" color="rgb(237,84,19)" />
          <Text className="text-white mt-4 text-lg">Identifying ingredients...</Text>
        </View>
      )}
      <Pressable
        onPress={handleCapture}
        disabled={isProcessing}
        className="absolute bottom-10 self-center bg-white rounded-full p-2"
        style={{ opacity: isProcessing ? 0.5 : 1 }}
      >
        <Circle color="rgb(237,84,19)" fill="rgb(237,84,19)" size={60} />
      </Pressable>
    </SafeAreaView>
  )
}