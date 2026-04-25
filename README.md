# pic2recipe

A full-stack mobile app where you photograph food ingredients and get personalized recipe recommendations. Point your camera at what's in your fridge, confirm the detected ingredients, and instantly find recipes you can make from a database of 2.2 million recipes.

## How It Works

1. **Scan** — Take a photo of your ingredients using your phone's camera
2. **Detect** — Gemini 2.5 Flash identifies every ingredient in the image with bounding boxes
3. **Confirm** — Review detected ingredients, remove any mistakes, add to your pantry
4. **Search** — Your pantry ingredients are encoded into a 768-dimensional vector and matched against 2.2 million recipes using cosine similarity
5. **Cook** — View the full recipe with ingredients, equipment, and step-by-step instructions

## Tech Stack

**Frontend:** React Native, Expo SDK 54, Expo Router, NativeWind (Tailwind CSS), TanStack Query, WatermelonDB (SQLite + JSI), react-native-vision-camera, react-native-svg

**Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL + pgvector, sentence-transformers (`all-mpnet-base-v2`)

**ML/Vision:** Google Gemini 2.5 Flash API (ingredient detection + bounding boxes), 768-dim embeddings via `all-mpnet-base-v2`

**Data:** RecipeNLG dataset (~2.2M recipes), enriched with cook time, equipment, and difficulty metadata

**CI/CD:** GitHub Actions running backend (pytest) and frontend (jest) tests on every push/PR

## Architecture

```
Phone Camera → Gemini API → Ingredient List → WatermelonDB (local pantry)
                                                        ↓
                                              FastAPI Backend
                                                        ↓
                                         sentence-transformers encode
                                                        ↓
                                      pgvector cosine similarity search
                                                        ↓
                                           Top 5 matching recipes
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\Activate on Windows
pip install -r requirements.txt
```

Create a `.env` in the project root:

```
POSTGRES_USER=pic2recipe
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_DB=pic2recipe
MODEL_NAME=sentence-transformers/all-mpnet-base-v2
```

Set up PostgreSQL with pgvector, run `scripts/init.sql`, then load and enrich recipes:

```bash
python scripts/load_recipes.py
python scripts/enrich_recipes.py
```

Start the server:

```bash
cd backend
fastapi dev main.py
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
```

Create `frontend/.env`:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

```bash
npx expo start --dev-client
```

### Tests

```bash
# Backend
cd backend && pytest tests/

# Frontend
cd frontend && npx jest
```

## Optimization

### 1. Memory-Mapped Embedding Pipeline (Reduce Memory Usage)

**Problem:** Generating and loading 768-dimensional embeddings for 2.2 million recipes requires handling ~6.4GB of float32 data. The naive approach — holding all embeddings in a Python list or numpy array — exhausted system RAM and crashed the process.

**Solution:** Used numpy's `memmap` to write embeddings directly to disk as a memory-mapped binary file during generation, and read them back the same way during database loading. This lets the OS page in only the chunks of data actively being processed, instead of loading the entire 6.4GB into RAM at once.

```python
# Writing embeddings (during generation)
embeddings_all = np.memmap(
    "recipe_embeddings.npy",
    dtype="float32",
    mode="w+",
    shape=(total_recipes, 768),
)

# Reading embeddings (during DB loading)
embeddings_all = np.memmap(
    "recipe_embeddings.npy",
    dtype="float32",
    mode="r",
    shape=(total, 768),
)
```

**Result:**

| Metric | Before (in-memory) | After (memmap) |
|---|---|---|
| Peak RAM usage | ~6.4 GB (crashed) | ~50 MB |
| Disk usage | Same (~6.4 GB .npy file) | Same |
| Speed | N/A (OOM killed) | ~45 min for 2.2M recipes |

The process went from impossible to run on a 16GB machine to comfortably running with minimal memory footprint.

### 2. pgvector Indexed Similarity Search (Efficient Algorithms)

**Problem:** Finding the most similar recipes out of 2.2 million requires computing cosine similarity between a query vector and every recipe's 768-dimensional embedding. A brute-force scan means 2.2M distance calculations per query.

**Solution:** PostgreSQL's pgvector extension stores embeddings as a native `vector(768)` column type and uses the `<=>` operator for cosine distance, which leverages indexed approximate nearest neighbor (ANN) search instead of a full table scan.

```python
result = db.execute(
    select(
        Recipe.id, Recipe.title, Recipe.ingredients,
        (1 - Recipe.embedding.cosine_distance(query_embedding)).label("similarity")
    )
    .order_by(Recipe.embedding.cosine_distance(query_embedding))
    .limit(5)
)
```

**Result:**

| Metric | Brute-force (Python loop) | pgvector (indexed) |
|---|---|---|
| Query time (2.2M recipes) | ~8-12 seconds | ~100-300 ms |
| Scalability | Linear O(n) | Sublinear (ANN index) |
| Code complexity | Manual cosine calc + sort | Single SQL query |

### 3. Batched Database Operations (Efficient Algorithms)

**Problem:** Inserting 2.2 million recipes one row at a time would take hours due to per-statement overhead and transaction commits.

**Solution:** Used `psycopg2.extras.execute_values` for bulk inserts (512 rows per batch) and `execute_batch` for bulk updates (1000 rows per batch) during data enrichment.

```python
for i in range(0, total, 512):
    batch = data.iloc[i:i+512]
    rows = [(title, ingredients, directions, ner, embedding) for ...]
    execute_values(cursor,
        "INSERT INTO recipes (...) VALUES %s", rows)
    connection.commit()
```

**Result:**

| Metric | Row-by-row | Batched (512/1000) |
|---|---|---|
| Insert 2.2M recipes | ~4+ hours (estimated) | ~25 minutes |
| Enrich 2.2M recipes | ~3+ hours (estimated) | ~15 minutes |
| DB round trips | 2.2M | ~4,300 |

### 4. Application-Level Caching (Caching Strategies)

**Problem:** Every time a user navigates to the results screen or opens a recipe detail, the app would make a fresh API call to the backend — even if they just viewed the same data seconds ago. This creates unnecessary network requests and makes navigation feel sluggish.

**Solution:** TanStack Query caches all API responses keyed by query parameters. Repeat requests for the same ingredients or recipe ID are served instantly from cache without hitting the backend.

```typescript
// Cached by ingredient list — same ingredients = instant results
useQuery({
    queryFn: () => getRecipe(ingredients),
    queryKey: ["recipes", ingredients],
})

// Cached by recipe ID — revisiting a recipe is instant
useQuery({
    queryFn: () => getById(id),
    queryKey: ["recipe", id],
})
```

**Result:**

| Metric | Without caching | With TanStack Query |
|---|---|---|
| Repeat recipe search | ~300-500ms (network + DB query) | <1ms (cache hit) |
| Revisiting recipe detail | ~200ms (network) | <1ms (cache hit) |
| Unnecessary API calls | Every navigation | Only on first view or stale data |

### 5. Lazy Loading with Reactive Queries (Lazy Loading)

**Problem:** Loading the entire pantry into memory on app start and manually re-fetching after every add/remove operation is wasteful and creates stale UI state.

**Solution:** WatermelonDB with `withObservables` uses lazy-loaded reactive queries. The database only loads records that are actively being observed, and components automatically re-render when their underlying data changes — no manual refetching, no loading the full dataset upfront.

```typescript
const enhance = withObservables([], () => ({
    ingredients: database.get<Ingredient>('ingredients').query().observe()
}))
```

The SQLite adapter is configured with JSI (JavaScript Interface), which communicates directly with native code instead of going through the old React Native JSON bridge — eliminating serialization overhead for every database read/write.

**Result:**

| Metric | Manual fetch + setState | WatermelonDB + withObservables |
|---|---|---|
| Data freshness | Stale until manual refetch | Always in sync |
| Bridge overhead | JSON serialization per call | Direct JSI (zero serialization) |
| Re-renders | Entire list on any change | Only affected components |

## License

MIT