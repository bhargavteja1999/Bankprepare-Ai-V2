from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.documents import router as documents_router
from app.routers.quizzes import router as quizzes_router
from app.routers.flashcards import router as flashcards_router
from app.routers.syllabus import router as syllabus_router
from app.routers.games import router as games_router
from app.routers.analytics import router as analytics_router

__all__ = [
    "auth_router",
    "users_router",
    "documents_router",
    "quizzes_router",
    "flashcards_router",
    "syllabus_router",
    "games_router",
    "analytics_router"
]
