from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), default="Quantitative Aptitude")
    topic = Column(String(150), default="General Practice")
    difficulty = Column(String(50), default="medium") # easy, medium, hard
    time_limit_minutes = Column(Integer, default=15)
    negative_marking = Column(Float, default=0.25)
    total_marks = Column(Float, default=10.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="quizzes")
    document = relationship("Document", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan", order_by="Question.order_index")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, default=0.0)
    total_marks = Column(Float, default=0.0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    unattempted_count = Column(Integer, default=0)
    accuracy_percentage = Column(Float, default=0.0)
    time_taken_seconds = Column(Integer, default=0)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", back_populates="quiz_attempts")
    answers = relationship("AttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")
