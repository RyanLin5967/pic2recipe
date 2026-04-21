import { View, Text, Image, Pressable, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, router } from "expo-router"
import Svg, { Rect, Text as SvgText } from "react-native-svg"
import React from "react"
import { VisionDetection } from "@/src/services/vision"
import { addIngredient } from "@/src/database/operations"

export default function Confirm() {
  const {
    photoPath,
    photoWidth,
    photoHeight,
    detections: detectionsStr,
  } = useLocalSearchParams<{
    photoPath: string
    photoWidth: string
    photoHeight: string
    detections: string
  }>()

  const detections = JSON.parse(detectionsStr) as VisionDetection[]
  const photoW = Number(photoWidth)
  const photoH = Number(photoHeight)
  const isLandscape = photoW > photoH

  const DISPLAY_WIDTH = 360
  const DISPLAY_HEIGHT = isLandscape
  ? (photoW / photoH) * DISPLAY_WIDTH
  : (photoH / photoW) * DISPLAY_WIDTH

  const handleConfirm = async () => {
    const detections = JSON.parse(detectionsStr) as VisionDetection[]
    for (let i = 0; i<detections.length; i++){
      await addIngredient(detections[i]["label"])
    }
    router.push("/")
  }

  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
        <Text className="text-white text-2xl font-bold mb-4">
          Found {detections.length} Ingredient{detections.length !== 1 ? "s" : ""}
        </Text>

        <View style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}>
          <Image
            source={{ uri: `file://${photoPath}` }}
            style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, borderRadius: 12 }}
          />
          <Svg
            style={{ position: "absolute", top: 0, left: 0 }}
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
          >
            {detections.map((d, i) => {
  const x1 = (d.box_2d[1] / 1000) * DISPLAY_WIDTH
  const y1 = (d.box_2d[0] / 1000) * DISPLAY_HEIGHT
  const x2 = (d.box_2d[3] / 1000) * DISPLAY_WIDTH
  const y2 = (d.box_2d[2] / 1000) * DISPLAY_HEIGHT

  return (
    <React.Fragment key={i}>
      <Rect
        x={x1}
        y={y1}
        width={x2 - x1}
        height={y2 - y1}
        stroke="rgb(237,84,19)"
        strokeWidth={3}
        fill="transparent"
      />
      <SvgText
        x={x1}
        y={y1 - 6}
        fill="rgb(237,84,19)"
        fontSize={14}
        fontWeight="bold"
      >
        {d.label}
      </SvgText>
    </React.Fragment>
  )
})}
          </Svg>
        </View>

        <View className="w-full mt-6">
          {detections.map((d, i) => (
            <View
              key={i}
              className="flex-row items-center bg-[rgb(59,61,69)] p-4 mb-2 rounded-2xl"
            >
              <Text className="text-white text-lg font-bold capitalize">{d.label}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row mt-4 gap-3">
          <Pressable
            onPress={() => router.back()}
            className="bg-[rgb(63,69,79)] px-6 py-3 rounded-2xl"
          >
            <Text className="text-white font-bold">Retake</Text>
          </Pressable>
          <Pressable
            onPress={handleConfirm}
            className="bg-[rgb(237,84,19)] px-6 py-3 rounded-2xl"
          >
            <Text className="text-white font-bold">Add to Pantry</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}