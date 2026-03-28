from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import settings

engine = create_engine(f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}")
SessionLocal = sessionmaker(bind=engine)

def get_session():
    db = SessionLocal()
    try:
        yield db # gives session to route
    finally:
        db.close() # close if fails/succeeds