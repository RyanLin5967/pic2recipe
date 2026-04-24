jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
}))
import axios from "axios"
import { getRecipe, getById } from "@/src/services/api"

const mockedAxios = axios as jest.Mocked<typeof axios>

it("gets back recipes for post", async () => {
  mockedAxios.post.mockResolvedValue({
    data: [
      {
        id: 1,
        title: "Pizza",
        ingredients: ["cheese", "tomato"],
        directions: ["Bake it"],
        similarity: 0.95,
        cook_time_minutes: 20,
        difficulty: "Easy",
        equipment: ["oven"],
      }
    ]
  })
  const result = await getRecipe(["cheese", "tomato"])
  expect(result).toHaveLength(1)
  expect(result[0].ingredients).toEqual(["cheese", "tomato"])
})

it("gets back recipes for get", async () => {
  mockedAxios.get.mockResolvedValue({
    data: 
      {
        title: "Pizza",
        ingredients: ["cheese", "tomato"],
        directions: ["bake"],
        cook_time_minutes: 60,
        equipment: ["oven"],
        difficulty: "Easy",
      }
  })
  const result = await getById(2)
  expect(result.title).toBe("Pizza")
})