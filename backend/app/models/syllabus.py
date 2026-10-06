from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base

class SyllabusSubject(Base):
    __tablename__ = "syllabus_subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False) # e.g. Quantitative Aptitude, Reasoning Ability
    code = Column(String(50), unique=True, index=True)
    icon = Column(String(50), default="BookOpen")
    description = Column(Text, nullable=True)
    weightage_percent = Column(Float, default=25.0)

    # Relationships
    topics = relationship("SyllabusTopic", back_populates="subject", cascade="all, delete-orphan")


class SyllabusTopic(Base):
    __tablename__ = "syllabus_topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("syllabus_subjects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False) # e.g. "Data Interpretation", "Syllogism", "RBI Monetary Policy"
    description = Column(Text, nullable=True)
    difficulty_level = Column(String(50), default="Medium")
    key_formulas_summary = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    # Relationships
    subject = relationship("SyllabusSubject", back_populates="topics")
    progress_records = relationship("UserTopicProgress", back_populates="topic", cascade="all, delete-orphan")


class UserTopicProgress(Base):
    __tablename__ = "user_topic_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(Integer, ForeignKey("syllabus_topics.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=False)
    mastery_percentage = Column(Float, default=0.0)
    questions_attempted = Column(Integer, default=0)
    questions_correct = Column(Integer, default=0)
    last_studied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    topic = relationship("SyllabusTopic", back_populates="progress_records")
