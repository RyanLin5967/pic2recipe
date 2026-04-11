from pydantic import BaseModel
from typing import Optional

class IngredientsRequest(BaseModel):
    ingredients: list[str]

class RecipeResponse(BaseModel):
    id: int
    title: str
    ingredients: list[str]
    directions: list[str]
    similarity: float
    cook_time_minutes: Optional[int]
    equipment: Optional[list[str]]
    difficulty: Optional[str]

class IdResponse(BaseModel):
    title: str
    ingredients: list[str]
    directions: list[str]
    cook_time_minutes: Optional[int]
    equipment: Optional[list[str]]
    difficulty: Optional[str]