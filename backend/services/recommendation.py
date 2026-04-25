from repositories.recipe_repo import get_recipe

def get_recommendations(ingredients, model, db):
    query = ", ".join(ingredients)
    embedding = model.encode(query).tolist()
    return get_recipe(db, embedding)
