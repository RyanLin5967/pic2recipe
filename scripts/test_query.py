import argparse
import psycopg2
from sentence_transformers import SentenceTransformer

DB_CONFIG = {
    "user": "pic2recipe",
    "password": "password6967",
    "host": "127.0.0.1",
    "port": "5433",
    "database": "pic2recipe",
}
MODEL_NAME = "sentence-transformers/all-mpnet-base-v2"


def query_recipes(ingredient_text, top_k=5):
    print(f"Query: \"{ingredient_text}\"")
    print("Loading model...")
    model = SentenceTransformer(MODEL_NAME)
    query_embedding = model.encode(ingredient_text).tolist()
    print("Searching database...\n")

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute(
        """
        SELECT
            id,
            title,
            ner,
            1 - (embedding <=> %s::vector) AS similarity
        FROM recipes
        ORDER BY embedding <=> %s::vector
        LIMIT %s;
        """,
        (query_embedding, query_embedding, top_k),
    )

    results = cur.fetchall()
    cur.close()
    conn.close()

    print(f"Top {top_k} matches:")
    print("-" * 60)
    for row_id, title, ner, similarity in results:
        print(f"  [{similarity:.3f}] {title}")
        print(f"           Ingredients: {', '.join(ner[:8])}")
        if len(ner) > 8:
            print(f"           ... and {len(ner) - 8} more")
        print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ingredients", type=str, default="chicken, garlic, onion, tomato")
    parser.add_argument("--top", type=int, default=5)
    args = parser.parse_args()

    query_recipes(args.ingredients, args.top)