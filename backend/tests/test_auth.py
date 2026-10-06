import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.base import Base
from app.database.connection import get_db
import app.models # noqa: F401

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_register_and_login():
    reg_response = client.post("/api/v1/auth/register", json={
        "email": "testcandidate@example.com",
        "password": "Password123!",
        "full_name": "Test Candidate",
        "target_exam": "SBI PO"
    })
    assert reg_response.status_code == 201
    data = reg_response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "testcandidate@example.com"

    # Login
    login_response = client.post("/api/v1/auth/login", json={
        "email": "testcandidate@example.com",
        "password": "Password123!"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Verify /auth/me
    me_response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["full_name"] == "Test Candidate"
