import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.base import Base
from app.database.connection import get_db
import app.models as app_models # noqa: F401

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_fc.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_database():
    # Set (and later clear) this module's DB override: the FastAPI app object
    # is shared across test modules, so a module-level override would leak
    # into other modules' tests (all modules are imported before any test runs).
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()

client = TestClient(app)

def get_auth_token():
    reg = client.post("/api/v1/auth/register", json={
        "email": "carduser@example.com",
        "password": "Password123!",
        "full_name": "Card User"
    })
    return reg.json()["access_token"]

def test_flashcard_deck_generation():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    gen_res = client.post("/api/v1/flashcards/generate", headers=headers, json={
        "topic": "Important Banking Abbreviations",
        "subject": "Banking Awareness",
        "num_cards": 4
    })
    assert gen_res.status_code == 201
    deck_data = gen_res.json()
    assert len(deck_data["cards"]) == 4

    card_id = deck_data["cards"][0]["id"]
    # Review card
    rev_res = client.post(f"/api/v1/flashcards/cards/{card_id}/review", headers=headers, json={
        "quality": 3 # Easy
    })
    assert rev_res.status_code == 200
    assert rev_res.json()["mastery_level"] >= 1
