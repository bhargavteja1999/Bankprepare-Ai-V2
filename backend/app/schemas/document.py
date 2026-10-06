from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DocumentBase(BaseModel):
    title: str
    subject: Optional[str] = "Banking Awareness"

class DocumentCreate(DocumentBase):
    raw_text: Optional[str] = None

class DocumentOut(DocumentBase):
    id: int
    user_id: int
    file_type: str
    file_size: int
    word_count: int
    summary: Optional[str] = None
    extracted_text_preview: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentDetail(DocumentOut):
    extracted_text: Optional[str] = None
