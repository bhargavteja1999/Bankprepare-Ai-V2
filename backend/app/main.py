import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.connection import engine
from app.database.base import Base
# Import all models to ensure they register with Base.metadata
import app.models # noqa: F401

from app.routers import (
    auth_router,
    users_router,
    documents_router,
    quizzes_router,
    flashcards_router,
    syllabus_router,
    games_router,
    analytics_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)
    # Ensure uploads folder exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="BankPrepare AI: Document-to-Interactive Quiz and Banking Exam Preparation Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Set up CORS — only the explicit allow-list (local dev + FRONTEND_URL set
# on the host for the deployed Vercel frontend). Never "*" with credentials.
_cors_origins = settings.allowed_origins if isinstance(settings.allowed_origins, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount upload directory
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers under API_V1_STR
api_prefix = settings.API_V1_STR

app.include_router(auth_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(documents_router, prefix=api_prefix)
app.include_router(quizzes_router, prefix=api_prefix)
app.include_router(flashcards_router, prefix=api_prefix)
app.include_router(syllabus_router, prefix=api_prefix)
app.include_router(games_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_STR
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
