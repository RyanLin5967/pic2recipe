from schemas.recipe import IngredientsRequest, RecipeResponse, IdResponse
from fastapi import APIRouter, Depends, HTTPException
from api.dependencies import get_session
from ml import ml_model
from services.recommendation import get_recommendations
from sqlalchemy.orm import Session
from repositories.recipe_repo import get_from_id

router = APIRouter(tags=["recipes"])

@router.post("/recipe", response_model=list[RecipeResponse])
def get_recipe(ingredients: IngredientsRequest, db: Session = Depends(get_session)):
    try: 
        result = get_recommendations(ingredients.ingredients, ml_model["transformer"], db)
        return result
    except: 
        raise HTTPException(
            status_code=404,
            detail="Error in querying ingredients"
        )
    
@router.get("/recipe/{id}", response_model=IdResponse)
def get_by_id(id: int, db: Session = Depends(get_session)):
    try:
        results = get_from_id(db, id)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=e
        )