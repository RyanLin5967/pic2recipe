from repositories.recipe_repo import get_from_id, get_recipe
from repositories.models.recipe import Recipe

def test_repo(db_session):
    recipe_a = Recipe(
        title="Garlic Butter Shrimp",
        ingredients=["shrimp", "butter", "garlic"],
        directions=["Melt butter.", "Cook shrimp."],
        ner=["shrimp", "butter", "garlic"],
        embedding=[0.2] * 768,
        cook_time_minutes=15
    )
    
    recipe_b = Recipe(
        title="Lemon Herb Salmon",
        ingredients=["salmon", "lemon", "garlic"],
        directions=["Season salmon.", "Bake."],
        ner=["salmon", "lemon", "garlic"],
        embedding=[0.200001] * 768,
        cook_time_minutes=20
    )
    
    recipe_c = Recipe(
        title="Double Choc Muffins",
        ingredients=["flour", "cocoa", "sugar"],
        directions=["Mix ingredients.", "Bake."],
        ner=["flour", "cocoa", "sugar"],
        embedding=[0.9] * 768,
        cook_time_minutes=30
    )
    db_session.add_all([recipe_a, recipe_b, recipe_c])
    db_session.commit()

    results = get_recipe(db_session, [0.2] * 768, 3)

    assert len(results) == 3
    assert hasattr(results[0], "similarity")

def test_repo_id(db_session):
    fake_recipe = Recipe(
        id=1,
        title="Garlic Butter Shrimp",
        ingredients=["shrimp", "butter", "garlic"],
        directions=["Melt butter.", "Cook shrimp."],
        ner=["shrimp", "butter", "garlic"],
        embedding=[0.2] * 768,
        cook_time_minutes=15
    )
    db_session.add(fake_recipe)
    db_session.commit()
    results = get_from_id(db_session, 1)
    assert results.title == "Garlic Butter Shrimp"