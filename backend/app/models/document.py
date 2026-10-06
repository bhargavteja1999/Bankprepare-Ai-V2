from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_type = Column(String(50), default="pdf") # pdf, docx, txt, text_input
    file_size = Column(Integer, default=0) # bytes
    word_count = Column(Integer, default=0)
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    subject = Column(String(100), default="Banking Awareness")
    status = Column(String(50), default="ready") # uploaded, processing, ready, error
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="documents")
    quizzes = relationship("Quiz", back_populates="document", cascade="all, delete-orphan")
    flashcard_decks = relationship("FlashcardDeck", back_populates="document", cascade="all, delete-orphan")
