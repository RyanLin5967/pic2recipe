import { Detection } from "../types";
import { CLASS_NAMES } from "@/src/constants/classNames"
export default function parseRawDetections(rawOutput: number[]): Detection[] {
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
  return Array.from(byClass.values())
}