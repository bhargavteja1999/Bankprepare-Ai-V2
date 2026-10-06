from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class UserActivityOut(BaseModel):
    id: int
    activity_type: str
    title: str
    details: Optional[str] = None
    score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SubjectPerformance(BaseModel):
    subject: str
    accuracy_percentage: float
    quizzes_taken: int
    total_questions: int

class DashboardStats(BaseModel):
    total_quizzes_taken: int
    average_accuracy: float
    total_questions_solved: int
    total_study_minutes: int
    streak_days: int
    flashcards_mastered: int
    recent_activities: List[UserActivityOut] = []
    subject_performances: List[SubjectPerformance] = []
    score_trends: List[Dict[str, Any]] = []

class TopicProgressUpdate(BaseModel):
    is_completed: Optional[bool] = None
    mastery_percentage: Optional[float] = None
