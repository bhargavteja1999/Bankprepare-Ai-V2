from app.services.document_processor import document_processor
from app.services.ai_generator import ai_generator
from app.services.auth_service import auth_service
from app.services.quiz_service import quiz_service
from app.services.flashcard_service import flashcard_service
from app.services.analytics_service import analytics_service

__all__ = [
    "document_processor",
    "ai_generator",
    "auth_service",
    "quiz_service",
    "flashcard_service",
    "analytics_service"
]
