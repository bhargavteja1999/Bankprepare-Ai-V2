from app.schemas.auth import Token, TokenPayload, LoginRequest, RegisterRequest
from app.schemas.user import UserBase, UserCreate, UserUpdate, UserOut, AuthResponse
from app.schemas.document import DocumentBase, DocumentCreate, DocumentOut, DocumentDetail
from app.schemas.question import (
    QuestionOptionBase, QuestionOptionCreate, QuestionOptionOut, QuestionOptionReview,
    QuestionBase, QuestionCreate, QuestionOut, QuestionReview
)
from app.schemas.quiz import (
    QuizBase, QuizCreateManual, QuizGenerateRequest, QuizOut, QuizDetail,
    AnswerSubmission, QuizSubmission, QuizAttemptOut
)
from app.schemas.flashcard import (
    FlashcardBase, FlashcardCreate, FlashcardOut,
    FlashcardDeckBase, FlashcardDeckCreate, FlashcardDeckOut, FlashcardDeckDetail,
    FlashcardGenerateRequest, FlashcardReviewRequest
)
from app.schemas.analytics import DashboardStats, SubjectPerformance, UserActivityOut, TopicProgressUpdate
