import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.base import Base
from app.database.connection import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_quiz.db"
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

def get_auth_token():
    reg = client.post("/api/v1/auth/register", json={
        "email": "quizuser@example.com",
        "password": "Password123!",
        "full_name": "Quiz User"
    })
    return reg.json()["access_token"]

def test_quiz_generation_and_submission():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    gen_res = client.post("/api/v1/quizzes/generate", headers=headers, json={
        "topic": "Quantitative Aptitude - Simple Interest",
        "subject": "Quantitative Aptitude",
        "num_questions": 3,
        "difficulty": "medium",
        "negative_marking": 0.25,
        "time_limit_minutes": 10
    })
    assert gen_res.status_code == 201
    quiz_data = gen_res.json()
    assert quiz_data["title"].startswith("Quiz:")
    assert len(quiz_data["questions"]) == 3

    quiz_id = quiz_data["id"]
    q1 = quiz_data["questions"][0]
    opt1 = q1["options"][0]["id"]

    # Submit quiz
    sub_res = client.post(f"/api/v1/quizzes/{quiz_id}/submit", headers=headers, json={
        "time_taken_seconds": 120,
        "answers": [
            {"question_id": q1["id"], "selected_option_id": opt1}
        ]
    })
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert "score" in sub_data
    assert "accuracy_percentage" in sub_data
