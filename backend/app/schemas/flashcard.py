from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class FlashcardBase(BaseModel):
    front: str
    back: str
    hint: Optional[str] = None

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardOut(FlashcardBase):
    id: int
    deck_id: int
    mastery_level: int
    interval_days: int
    next_review_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class FlashcardDeckBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject: Optional[str] = "Banking Awareness"

class FlashcardDeckCreate(FlashcardDeckBase):
    document_id: Optional[int] = None
    cards: List[FlashcardCreate] = []

class FlashcardGenerateRequest(BaseModel):
    document_id: Optional[int] = None
    raw_text: Optional[str] = None
    topic: Optional[str] = "Banking & Financial Abbreviations"
    subject: Optional[str] = "Banking Awareness"
    num_cards: int = 8

class FlashcardDeckOut(FlashcardDeckBase):
    id: int
    user_id: int
    document_id: Optional[int] = None
    cards_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class FlashcardDeckDetail(FlashcardDeckOut):
    cards: List[FlashcardOut] = []

class FlashcardReviewRequest(BaseModel):
    quality: int # 0: Again, 1: Hard, 2: Good, 3: Easy
