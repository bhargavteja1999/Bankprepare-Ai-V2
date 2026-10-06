from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.base import Base

class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), default="Banking Awareness")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="flashcard_decks")
    document = relationship("Document", back_populates="flashcard_decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    deck_id = Column(Integer, ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    hint = Column(Text, nullable=True)
    mastery_level = Column(Integer, default=0) # 0 to 5
    interval_days = Column(Integer, default=1)
    next_review_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    deck = relationship("FlashcardDeck", back_populates="cards")
