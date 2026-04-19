import { useRef, useCallback, useMemo } from "react"
import { useTensorflowModel } from "react-native-fast-tflite"
import { useFrameProcessor } from "react-native-vision-camera"
import { useResizePlugin } from "vision-camera-resize-plugin"
import { Worklets } from "react-native-worklets-core"
import { CLASS_NAMES } from "@/src/constants/classNames"
import { Detection } from "@/src/types"

export function useIngredientDetection() {
  const model = useTensorflowModel(require("@/assets/models/best_float16.tflite"))
  const { resize } = useResizePlugin()
  const latestDetections = useRef<Detection[]>([])
  
  const shouldProcess = useMemo(() => Worklets.createSharedValue(false), [])

  const handleDetections = useCallback((rawOutput: number[]) => {
  const P = 8400
  const NUM_CLASSES = 120
  const CONFIDENCE_THRESHOLD = 0.25  // lower threshold for TFLite
  const byClass = new Map<string, Detection>()

  for (let i = 0; i < P; i++) {
    // Find highest class score (transposed: row * P + col)
    let maxScore = 0
    let maxClassId = 0
    for (let c = 0; c < NUM_CLASSES; c++) {
      const score = rawOutput[(4 + c) * P + i]
      if (score > maxScore) {
        maxScore = score
        maxClassId = c
      }
    }

    if (maxScore > CONFIDENCE_THRESHOLD) {
      const cx = rawOutput[0 * P + i]
      const cy = rawOutput[1 * P + i]
      const w = rawOutput[2 * P + i]
      const h = rawOutput[3 * P + i]

      // Convert cxcywh to x1y1x2y2 (already normalized 0-1)
      const x1 = cx - w / 2
      const y1 = cy - h / 2
      const x2 = cx + w / 2
      const y2 = cy + h / 2

      const name = CLASS_NAMES[maxClassId] || `Unknown(${maxClassId})`
      const pct = Math.round(maxScore * 100)

      const existing = byClass.get(name)
      if (!existing || existing.confidence < pct) {
        byClass.set(name, { name, confidence: pct, x1, y1, x2, y2 })
      }
    }
  }

  console.log("Parsed:", byClass.size, "unique classes")
  if (byClass.size > 0) {
    const top = Array.from(byClass.values()).sort((a, b) => b.confidence - a.confidence).slice(0, 3)
    console.log("Top 3:", top.map(d => `${d.name}(${d.confidence}%)`))
  }
  latestDetections.current = Array.from(byClass.values())
}, [])

  const onDetections = Worklets.createRunOnJS(handleDetections)

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet"
    if (!shouldProcess.value || model.state !== "loaded") return
    shouldProcess.value = false

    const resized = resize(frame, {
      scale: { width: 640, height: 640 },
      pixelFormat: "rgb",
      dataType: "float32",
    })

    const float32 = new Float32Array(resized)
    const outputs = model.model.runSync([float32])
    const flatOutput = Array.from(outputs[0] as Float32Array)
    onDetections(flatOutput)
  }, [model, onDetections, shouldProcess])

  const triggerCapture = () => {
    shouldProcess.value = true
  }

  const clearDetections = () => {
    latestDetections.current = []
  }

  return {
    modelState: model.state,
    frameProcessor,
    triggerCapture,
    clearDetections,
    latestDetections,
  }
}