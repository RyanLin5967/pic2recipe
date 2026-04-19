import { View, Text, Image, Pressable, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, router } from "expo-router"
import Svg, { Rect, Text as SvgText } from "react-native-svg"
import React from "react"
import { Detection } from "@/src/types"

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

  const detections = JSON.parse(detectionsStr) as Detection[]
  
  const photoW = Number(photoWidth)
const photoH = Number(photoHeight)
const isLandscape = photoW > photoH

const DISPLAY_WIDTH = 360
const DISPLAY_HEIGHT = isLandscape
  ? (photoW / photoH) * DISPLAY_WIDTH
  : (photoH / photoW) * DISPLAY_WIDTH
  const handleConfirm = async () => {
    //have to add ingredient to db
    router.push("/")
  }

  return (
    <SafeAreaView className="flex-1 bg-[rgb(28,29,33)]">
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
        <Text className="text-white text-2xl font-bold mb-4">
          Detected Ingredients
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
  let x1, y1, x2, y2

  if (isLandscape) {
    // Rotate coords 90° CW: landscape → portrait
    x1 = (1 - d.y2) * DISPLAY_WIDTH
    y1 = d.x1 * DISPLAY_HEIGHT
    x2 = (1 - d.y1) * DISPLAY_WIDTH
    y2 = d.x2 * DISPLAY_HEIGHT
  } else {
    x1 = d.x1 * DISPLAY_WIDTH
    y1 = d.y1 * DISPLAY_HEIGHT
    x2 = d.x2 * DISPLAY_WIDTH
    y2 = d.y2 * DISPLAY_HEIGHT
  }

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
        fill="rgb(237,84,18)"
        fontSize={14}
        fontWeight="bold"
      >
        {d.name} ({d.confidence}%)
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
              className="flex-row justify-between bg-[rgb(59,61,69)] p-4 mb-2 rounded-2xl"
            >
              <Text className="text-white text-lg font-bold">{d.name}</Text>
              <Text className="text-[rgb(237,84,19)] font-bold">
                {d.confidence}%
              </Text>
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