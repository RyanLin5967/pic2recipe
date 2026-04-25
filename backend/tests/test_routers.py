from schemas.recipe import IngredientsRequest, RecipeResponse, IdResponse
from repositories.models.recipe import Recipe

def test_recipe_valid(test_client, mock_transformer, db_session):
    fake_recipe = Recipe(
        title="Test Pizza",
        ingredients=["cheese", "pizza"],
        directions=["Bake it."],
        ner=["cheese", "pizza"],
        embedding=[0.1] * 768,
        cook_time_minutes=20
    )
    db_session.add(fake_recipe)
    db_session.commit()
    request_data = IngredientsRequest(ingredients=["cheese", "pizza"])
    response = test_client.post("/recipe",  json=request_data.model_dump())
    recipes = response.json()
    validated_recipe = RecipeResponse.model_validate(recipes[0])
    assert response.status_code == 200
    assert 0 <= validated_recipe.similarity <= 1
    assert len(validated_recipe.ingredients) > 0
    assert len(validated_recipe.directions) > 0

def test_recipe_invalid(test_client, mock_transformer):
    request_data = ["cheese", "pizza"]
    response = test_client.post("/recipe", json=request_data)

    assert response.status_code == 422
    assert "detail" in response.json()

def test_recipeid_valid(test_client, mock_transformer, db_session):
    fake_recipe = Recipe(
        id=1,
        title="Specific Recipe",
        ingredients=["water"],
        directions=["Boil."],
        ner=["water"],
        embedding=[0.1] * 768
    )
    db_session.add(fake_recipe)
    db_session.commit()
    response = test_client.get("/recipe/1")
    recipe = response.json()
    validated_recipe = IdResponse.model_validate(recipe)
    assert len(validated_recipe.ingredients) > 0
    assert len(validated_recipe.directions) > 0
    assert response.status_code == 200

def test_recipeid_invalid(test_client, mock_transformer):
    id = "invalid id"
    response = test_client.get(f"/recipe/{id}")
    assert response.status_code == 422
    assert "detail" in response.json()