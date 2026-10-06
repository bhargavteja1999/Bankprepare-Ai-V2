from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.question import QuestionCreate, QuestionOut, QuestionReview

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject: Optional[str] = "Quantitative Aptitude"
    topic: Optional[str] = "General Practice"
    difficulty: Optional[str] = "medium"
    time_limit_minutes: Optional[int] = 15
    negative_marking: Optional[float] = 0.25

class QuizCreateManual(QuizBase):
    document_id: Optional[int] = None
    questions: List[QuestionCreate]

class QuizGenerateRequest(BaseModel):
    document_id: Optional[int] = None
    raw_text: Optional[str] = None
    topic: Optional[str] = "Banking Awareness & Financial Systems"
    subject: Optional[str] = "General/Banking Awareness"
    num_questions: int = 5
    difficulty: str = "medium" # easy, medium, hard
    question_types: List[str] = ["mcq"] # mcq, true_false, fill_blank
    time_limit_minutes: int = 15
    negative_marking: float = 0.25

class QuizOut(QuizBase):
    id: int
    user_id: int
    document_id: Optional[int] = None
    total_marks: float
    created_at: datetime
    questions_count: int = 0

    class Config:
        from_attributes = True

class QuizDetail(QuizOut):
    questions: List[QuestionOut] = []

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None
    text_response: Optional[str] = None

class QuizSubmission(BaseModel):
    time_taken_seconds: int
    answers: List[AnswerSubmission]

class QuizAttemptOut(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    score: float
    total_marks: float
    correct_count: int
    incorrect_count: int
    unattempted_count: int
    accuracy_percentage: float
    time_taken_seconds: int
    completed_at: datetime
    questions_review: Optional[List[QuestionReview]] = []

    class Config:
        from_attributes = True
