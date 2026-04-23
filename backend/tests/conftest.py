from main import app
from fastapi.testclient import TestClient
import pytest
from unittest.mock import MagicMock, patch
from ml import ml_model
from config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.dependencies import get_session
from repositories.models.recipe import Recipe, Base

engine = create_engine(f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}_test")
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture
def test_client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_session] = override_get_db
    return TestClient(app)

@pytest.fixture
def mock_transformer():
    mock = MagicMock()
    mock_result = MagicMock()
    fake_vector = [0.1] * 768 
    mock_result.tolist.return_value = fake_vector
    mock.encode.return_value = fake_vector 
    mock.encode.return_value = mock_result
    original_model = ml_model.get("transformer")
    ml_model["transformer"] = mock
    yield mock
    ml_model["transformer"] = original_model

@pytest.fixture
def mock_repo():
    fake_recipe = MagicMock()
    fake_recipe.title = "Double Choc Muffins"
    mock_func = MagicMock()
    mock_func.return_value = [fake_recipe]
    with patch("services.recommendation.get_recipe", mock_func):
        yield mock_func
    
@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()