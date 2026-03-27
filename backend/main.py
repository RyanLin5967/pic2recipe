# receives post request from frontend in this format: {"ingredients": ["x", "y", "z"]}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from schemas.recipe import IngredientsRequest
from api.routers import recipes
from contextlib import asynccontextmanager
from sentence_transformers import SentenceTransformer

ml_model = {}
@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_model["transformer"] = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
    yield
    ml_model.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(recipes.router)
