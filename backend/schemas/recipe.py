from pydantic import BaseModel

class IngredientsRequest(BaseModel):
    ingredients: list[str]

class RecipeResponse(BaseModel):
    id: int
    title: str
    ingredients: list[str]
    directions: list[str]
    similarity: float