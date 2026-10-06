from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.analytics import UserActivity

router = APIRouter(prefix="/games", tags=["Games"])

@router.get("/speed-challenge")
def get_speed_challenge(current_user: User = Depends(get_current_user)):
    drills = [
        {
            "id": 1,
            "prompt": "Compute quickly: 15% of 480 + 25% of 640",
            "options": ["232", "240", "224", "256"],
            "correct_index": 0, # 72 + 160 = 232
            "time_sec": 20
        },
        {
            "id": 2,
            "prompt": "Find missing number: 7, 14, 42, 168, ?",
            "options": ["840", "672", "504", "1008"],
            "correct_index": 0, # *2, *3, *4, *5 = 840
            "time_sec": 20
        },
        {
            "id": 3,
            "prompt": "What is the square of 65?",
            "options": ["4225", "4125", "4325", "4025"],
            "correct_index": 0, # 6*7=42 -> 4225
            "time_sec": 15
        },
        {
            "id": 4,
            "prompt": "If A is brother of B, B is sister of C, and C is father of D, how is A related to D?",
            "options": ["Paternal Uncle", "Father", "Maternal Uncle", "Grandfather"],
            "correct_index": 0,
            "time_sec": 20
        },
        {
            "id": 5,
            "prompt": "Which bank was the first bank established in India?",
            "options": ["Bank of Hindustan (1770)", "General Bank of India", "Imperial Bank of India", "Punjab National Bank"],
            "correct_index": 0,
            "time_sec": 15
        }
    ]
    return {
        "title": "60-Second Rapid Banking Speed Drill",
        "description": "Test mental calculation speed and core awareness under time pressure!",
        "time_limit_seconds": 90,
        "questions": drills
    }

@router.post("/score")
def submit_game_score(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    score = payload.get("score", 0)
    game_title = payload.get("title", "Speed Challenge")
    
    activity = UserActivity(
        user_id=current_user.id,
        activity_type="game_played",
        title=f"Completed {game_title}",
        details=f"Earned {score} points in rapid fire drill",
        score=float(score)
    )
    db.add(activity)
    db.commit()
    return {"message": "Game result logged successfully", "score": score}
