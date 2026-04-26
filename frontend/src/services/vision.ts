import { VisionDetection } from "../types"
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`

export async function identifyIngredients(base64Image: string): Promise<VisionDetection[]> {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image,
            }
          },
          {
            text: `Detect all food ingredients in this image OR Detect all food ingredients inside a receipt. 
            Return a JSON list where each physical food item OR receipt food item label has 
            "box_2d" with [ymin, xmin, ymax, xmax] normalized to 0-1000, 
            and "label" with the ingredient name. Example: [{"box_2d": [100, 200, 500, 600], "label": "apple"}]
            For receipts, return the "base" ingredient. for example, if there is "banana cavandish", the label should be "banana",
            or if it's green grapes, the label should be grapes. For physical ingredients, just make the label the actual food item. 
            Also, do not return duplicate ingredients, 
            each ingredient in the list should be unique. Make sure that each item in the list IS an ingredient. 
            If there are no food ingredients, simply return an empty array.`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.5,
        responseMimeType: "application/json",
      }
    })
  })
  
  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"

  try {
    const cleaned = text.replace(/```json\n?|```\n?/g, "").trim()
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}