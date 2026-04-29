jest.mock("@/src/database/index", () => ({
  database: {
    get: jest.fn(),
    write: jest.fn(),
  }
}))

import { usesWhatIngredients } from "@/src/components/RecipeCard";
import { Recipe } from "@/src/types";

it("should include ingredients used", () => {
    const recipe = {
        id: 1,
        title: "Pizza",
        ingredients: ["cheese", "tomato"],
        directions: ["bake"],
        cook_time_minutes: 60,
        difficulty: "Easy",
        equipment: ["oven"]
    }
    const ingredients = ["cheese", "tomato"]
    const usesIng = usesWhatIngredients(recipe as Recipe, ingredients)
    expect(usesIng).toBe("Uses your: cheese, tomato")
})