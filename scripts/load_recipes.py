import psycopg2
from psycopg2.extras import execute_values
import pandas as pd
import numpy as np
import ast

def clean(value):
    if isinstance(value, str):
        return value.replace("\x00", "")
    if isinstance(value, list):
        return [v.replace("\x00", "") if isinstance(v, str) else v for v in value]
    return value

data = pd.read_csv("C:/Users/idide/pic2recipe/scripts/data/full_dataset.csv")

total = len(data)
embeddings_all = np.memmap(
    "C:/Users/idide/pic2recipe/scripts/data/recipe_embeddings.npy",
    dtype="float32",
    mode="r",
    shape=(total, 768),
)

connection = psycopg2.connect(
    user="pic2recipe",
    password="password6967",
    host="127.0.0.1",
    port="5433",
    database="pic2recipe"
)
cursor = connection.cursor()
cursor.execute("TRUNCATE TABLE recipes RESTART IDENTITY;")
connection.commit()

for i in range(0, total, 512):
    batch_end = min(i + 512, total)
    batch = data.iloc[i:batch_end]

    rows = []
    for j in range(batch_end - i):
        try:
            rows.append((
                clean(str(batch["title"].iloc[j])),
                clean(ast.literal_eval(batch["ingredients"].iloc[j])),
                clean(ast.literal_eval(batch["directions"].iloc[j])),
                clean(ast.literal_eval(batch["NER"].iloc[j])),
                embeddings_all[i + j].tolist(),
            ))
        except Exception as e:
            print(f"Skipping recipe {i + j}: {e}")
            continue

    execute_values(
        cursor,
        "INSERT INTO recipes (title, ingredients, directions, ner, embedding) VALUES %s",
        rows
    )
    connection.commit()

    if (i // 512) % 50 == 0:
        print(f"[{i + len(rows):,}/{total:,}]")

cursor.close()
connection.close()
