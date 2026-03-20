CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    ingredients TEXT[] NOT NULL,
    directions TEXT[] NOT NULL,
    ner TEXT[] NOT NULL,
    embedding vector(768) NOT NULL
)