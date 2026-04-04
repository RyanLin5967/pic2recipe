# takes a vector + db session, gets most similar embeddings, returns results
from repositories.models.recipe import Recipe
from sqlalchemy import select

def get_recipe(db, query_embedding, limit=5):
    result = db.execute(
        select(
            Recipe.id,
            Recipe.title,
            Recipe.ingredients,
            Recipe.directions,
            Recipe.ner, # returning this might be an issue later cuz response schema doesn't have this (fine for now)
            (1-Recipe.embedding.cosine_distance(query_embedding)).label("similarity")
        )
        .order_by(Recipe.embedding.cosine_distance(query_embedding))
        .limit(limit)
    ).all()
    return result

def get_from_id(db, id):
    result = db.execute(
        select(
            Recipe.title,
            Recipe.ingredients,
            Recipe.directions,
        )
        .where(Recipe.id == id)).one()
    return result