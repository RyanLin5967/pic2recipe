# gets ingredients from router -> encodes into vector -> calls recipe_repo.py -> returns results
# separated cuz if you want to add other features, you can "filter" it here instead of where the querying happens
from repositories.recipe_repo import get_recipe

def get_recommendations(ingredients, model, db):
    query = ", ".join(ingredients)
    embedding = model.encode(query).tolist()
    return get_recipe(db, embedding)
