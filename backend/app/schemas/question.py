from typing import List, Optional
from pydantic import BaseModel

class QuestionOptionBase(BaseModel):
    option_text: str
    is_correct: bool = False
    order_index: int = 0

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOptionOut(BaseModel):
    id: int
    option_text: str
    order_index: int

    class Config:
        from_attributes = True

class QuestionOptionReview(QuestionOptionOut):
    is_correct: bool

class QuestionBase(BaseModel):
    question_text: str
    question_type: str = "mcq" # mcq, true_false, fill_blank
    marks: float = 1.0
    negative_marks: float = 0.25
    explanation: Optional[str] = None
    reference_note: Optional[str] = None
    order_index: int = 0

class QuestionCreate(QuestionBase):
    options: List[QuestionOptionCreate] = []

class QuestionOut(QuestionBase):
    id: int
    quiz_id: int
    options: List[QuestionOptionOut] = []

    class Config:
        from_attributes = True

class QuestionReview(QuestionBase):
    id: int
    quiz_id: int
    options: List[QuestionOptionReview] = []
    user_selected_option_id: Optional[int] = None
    user_text_answer: Optional[str] = None
    is_user_correct: bool = False
    marks_awarded: float = 0.0

    class Config:
        from_attributes = True
