from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="mcq") # mcq, true_false, fill_blank
    marks = Column(Float, default=1.0)
    negative_marks = Column(Float, default=0.25)
    explanation = Column(Text, nullable=True)
    reference_note = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order_index")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    # Relationships
    question = relationship("Question", back_populates="options")


class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_option_id = Column(Integer, nullable=True)
    user_text_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, default=False)
    marks_awarded = Column(Float, default=0.0)

    # Relationships
    attempt = relationship("QuizAttempt", back_populates="answers")
