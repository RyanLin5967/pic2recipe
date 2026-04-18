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
    console.log("handleDetections called with output of length:", rawOutput.length)
    const byClass = new Map<string, Detection>()

    for (let i = 0; i < 300; i++) {
      const offset = i * 6
      const confidence = rawOutput[offset + 4]
      if (confidence > 0.5) {
        const classId = Math.round(rawOutput[offset + 5])
        const name = CLASS_NAMES[classId] || `Unknown(${classId})`
        const pct = Math.round(confidence * 100)

        const existing = byClass.get(name)
        if (!existing || existing.confidence < pct) {
          byClass.set(name, {
            name,
            confidence: pct,
            x1: rawOutput[offset + 0],
            y1: rawOutput[offset + 1],
            x2: rawOutput[offset + 2],
            y2: rawOutput[offset + 3],
          })
        }
      }
    }

    console.log("Parsed:", byClass.size, "unique classes")
    latestDetections.current = Array.from(byClass.values())
  }, [])

  const onDetections = Worklets.createRunOnJS(handleDetections)

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet"
    if (!shouldProcess.value || model.state !== "loaded") return
    shouldProcess.value = false

    console.log("Running inference!")
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
    console.log("triggerCapture called, setting shouldProcess to true")
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