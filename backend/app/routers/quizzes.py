from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.quiz import Quiz, QuizAttempt
from app.models.document import Document
from app.models.question import Question, QuestionOption
from app.schemas.quiz import (
    QuizOut, QuizDetail, QuizGenerateRequest, QuizCreateManual,
    QuizSubmission, QuizAttemptOut
)
from app.services.ai_generator import ai_generator
from app.services.quiz_service import quiz_service

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.post("/generate", response_model=QuizDetail, status_code=status.HTTP_201_CREATED)
def generate_quiz_ai(
    req: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document_text = req.raw_text or ""
    doc_title = req.topic or "Banking Concept"

    if req.document_id:
        doc = db.query(Document).filter(Document.id == req.document_id, Document.user_id == current_user.id).first()
        if doc:
            document_text = doc.extracted_text or doc.summary or ""
            doc_title = doc.title

    generated_questions = ai_generator.generate_quiz(
        document_text=document_text,
        topic=req.topic or doc_title,
        subject=req.subject or "Quantitative Aptitude",
        num_questions=req.num_questions,
        difficulty=req.difficulty,
        question_types=req.question_types
    )

    quiz = quiz_service.create_quiz_with_questions(
        db=db,
        user_id=current_user.id,
        title=f"Quiz: {req.topic or doc_title}",
        description=f"Generated {req.difficulty.capitalize()} level quiz on {req.subject}",
        subject=req.subject or "Quantitative Aptitude",
        topic=req.topic or doc_title,
        difficulty=req.difficulty,
        time_limit_minutes=req.time_limit_minutes,
        negative_marking=req.negative_marking,
        document_id=req.document_id,
        questions_data=generated_questions
    )

    return quiz

@router.post("/manual", response_model=QuizDetail, status_code=status.HTTP_201_CREATED)
def create_quiz_manual(
    req: QuizCreateManual,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    questions_dicts = [q.model_dump() for q in req.questions]
    quiz = quiz_service.create_quiz_with_questions(
        db=db,
        user_id=current_user.id,
        title=req.title,
        description=req.description,
        subject=req.subject or "Reasoning Ability",
        topic=req.topic or "General",
        difficulty=req.difficulty or "medium",
        time_limit_minutes=req.time_limit_minutes or 15,
        negative_marking=req.negative_marking or 0.25,
        document_id=req.document_id,
        questions_data=questions_dicts
    )
    return quiz

@router.get("", response_model=List[QuizOut])
def list_quizzes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quizzes = db.query(Quiz).filter(Quiz.user_id == current_user.id).order_by(Quiz.created_at.desc()).all()
    results = []
    for q in quizzes:
        results.append(QuizOut(
            id=q.id,
            user_id=q.user_id,
            document_id=q.document_id,
            title=q.title,
            description=q.description,
            subject=q.subject,
            topic=q.topic,
            difficulty=q.difficulty,
            time_limit_minutes=q.time_limit_minutes,
            negative_marking=q.negative_marking,
            total_marks=q.total_marks,
            created_at=q.created_at,
            questions_count=len(q.questions)
        ))
    return results

@router.get("/{quiz_id}", response_model=QuizDetail)
def get_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.post("/{quiz_id}/submit", response_model=QuizAttemptOut)
def submit_quiz(
    quiz_id: int,
    submission: QuizSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = quiz_service.evaluate_quiz_submission(
        db=db,
        quiz_id=quiz_id,
        user_id=current_user.id,
        submission=submission
    )
    return result

@router.get("/{quiz_id}/attempts", response_model=List[QuizAttemptOut])
def get_quiz_attempts(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.quiz_id == quiz_id,
        QuizAttempt.user_id == current_user.id
    ).order_by(QuizAttempt.completed_at.desc()).all()
    return attempts

@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    db.delete(quiz)
    db.commit()
    return None
