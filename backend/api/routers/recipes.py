from schemas.recipe import IngredientsRequest, RecipeResponse
from fastapi import APIRouter

router = APIRouter(tags=["recipes"])

@router.post("/recipe", response_model=list[RecipeResponse])
def get_recipe(ingredients: IngredientsRequest):
    pass
