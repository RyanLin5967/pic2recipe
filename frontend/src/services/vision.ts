const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`
export type VisionDetection = {
  label: string
  box_2d: [number, number, number, number]  // [ymin, xmin, ymax, xmax] 0-1000
}

export async function identifyIngredients(base64Image: string): Promise<VisionDetection[]> {
    console.log("Sending image to Gemini, base64 length:", base64Image.length)

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
            text: 'Detect all food ingredients in this image. Return a JSON list where each item has "box_2d" with [ymin, xmin, ymax, xmax] normalized to 0-1000, and "label" with the ingredient name. Example: [{"box_2d": [100, 200, 500, 600], "label": "apple"}]'
          }
        ]
      }],
      generationConfig: {
        temperature: 0.5,
      }
    })
  })
  

  const data = await response.json()
    console.log("Gemini raw response:", JSON.stringify(data).slice(0, 500))

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    console.log("Gemini text:", text)

  const cleaned = text.replace(/```json\n?|```\n?/g, "").trim()
  return JSON.parse(cleaned)
}