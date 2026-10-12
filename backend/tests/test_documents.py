import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.base import Base
from app.database.connection import get_db
import app.models as app_models # noqa: F401

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_docs.db"
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
        "email": "docuser@example.com",
        "password": "Password123!",
        "full_name": "Doc User"
    })
    return reg.json()["access_token"]

def test_document_text_creation():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/api/v1/documents/text", headers=headers, json={
        "title": "RBI Monetary Policy 2026",
        "subject": "Banking Awareness",
        "raw_text": "The Reserve Bank of India maintained the repo rate unchanged at 6.5 percent in its recent MPC meeting."
    })
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "RBI Monetary Policy 2026"
    assert data["word_count"] > 5
    
    # List documents
    list_res = client.get("/api/v1/documents", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1
