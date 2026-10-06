from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from app.models.quiz import Quiz, QuizAttempt
from app.models.question import Question, QuestionOption, AttemptAnswer
from app.models.analytics import UserActivity
from app.schemas.quiz import QuizSubmission, QuizAttemptOut
from app.schemas.question import QuestionReview, QuestionOptionReview

class QuizService:
    @staticmethod
    def create_quiz_with_questions(
        db: Session,
        user_id: int,
        title: str,
        description: Optional[str],
        subject: str,
        topic: str,
        difficulty: str,
        time_limit_minutes: int,
        negative_marking: float,
        document_id: Optional[int],
        questions_data: List[Dict[str, Any]]
    ) -> Quiz:
        total_marks = sum(q.get("marks", 1.0) for q in questions_data)
        
        quiz = Quiz(
            user_id=user_id,
            document_id=document_id,
            title=title,
            description=description,
            subject=subject,
            topic=topic,
            difficulty=difficulty,
            time_limit_minutes=time_limit_minutes,
            negative_marking=negative_marking,
            total_marks=total_marks
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)

        # Add questions and options
        for idx, q_dict in enumerate(questions_data):
            question = Question(
                quiz_id=quiz.id,
                question_text=q_dict.get("question_text", "Question"),
                question_type=q_dict.get("question_type", "mcq"),
                marks=float(q_dict.get("marks", 1.0)),
                negative_marks=float(q_dict.get("negative_marks", negative_marking)),
                explanation=q_dict.get("explanation", ""),
                reference_note=q_dict.get("reference_note", ""),
                order_index=idx
            )
            db.add(question)
            db.commit()
            db.refresh(question)

            for opt_idx, opt_dict in enumerate(q_dict.get("options", [])):
                option = QuestionOption(
                    question_id=question.id,
                    option_text=opt_dict.get("option_text", ""),
                    is_correct=bool(opt_dict.get("is_correct", False)),
                    order_index=opt_idx
                )
                db.add(option)
            db.commit()

        # Log activity
        activity = UserActivity(
            user_id=user_id,
            activity_type="quiz_created",
            title=f"Created quiz: {title}",
            details=f"{len(questions_data)} questions in {subject}"
        )
        db.add(activity)
        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def evaluate_quiz_submission(
        db: Session,
        quiz_id: int,
        user_id: int,
        submission: QuizSubmission
    ) -> Dict[str, Any]:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        questions = db.query(Question).filter(Question.quiz_id == quiz_id).order_by(Question.order_index).all()
        submission_map = {ans.question_id: ans for ans in submission.answers}

        total_score = 0.0
        correct_count = 0
        incorrect_count = 0
        unattempted_count = 0
        total_max_marks = quiz.total_marks or float(len(questions))

        attempt = QuizAttempt(
            quiz_id=quiz.id,
            user_id=user_id,
            time_taken_seconds=submission.time_taken_seconds,
            total_marks=total_max_marks
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

        questions_review: List[Dict[str, Any]] = []

        for q in questions:
            user_ans = submission_map.get(q.id)
            selected_opt_id = user_ans.selected_option_id if user_ans else None
            text_ans = user_ans.text_response if user_ans else None
            
            is_correct = False
            marks_awarded = 0.0

            if selected_opt_id is None and not text_ans:
                unattempted_count += 1
                marks_awarded = 0.0
            else:
                # Check option correctness
                correct_opt = next((opt for opt in q.options if opt.is_correct), None)
                if selected_opt_id is not None:
                    if correct_opt and selected_opt_id == correct_opt.id:
                        is_correct = True
                        marks_awarded = q.marks
                        correct_count += 1
                        total_score += marks_awarded
                    else:
                        is_correct = False
                        marks_awarded = -q.negative_marks
                        incorrect_count += 1
                        total_score += marks_awarded
                elif text_ans and correct_opt:
                    if text_ans.strip().lower() == correct_opt.option_text.strip().lower():
                        is_correct = True
                        marks_awarded = q.marks
                        correct_count += 1
                        total_score += marks_awarded
                    else:
                        is_correct = False
                        marks_awarded = -q.negative_marks
                        incorrect_count += 1
                        total_score += marks_awarded

            attempt_ans = AttemptAnswer(
                attempt_id=attempt.id,
                question_id=q.id,
                selected_option_id=selected_opt_id,
                user_text_answer=text_ans,
                is_correct=is_correct,
                marks_awarded=marks_awarded
            )
            db.add(attempt_ans)

            # Build review object
            options_review = [
                {
                    "id": opt.id,
                    "option_text": opt.option_text,
                    "order_index": opt.order_index,
                    "is_correct": opt.is_correct
                }
                for opt in q.options
            ]

            questions_review.append({
                "id": q.id,
                "quiz_id": q.quiz_id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "marks": q.marks,
                "negative_marks": q.negative_marks,
                "explanation": q.explanation,
                "reference_note": q.reference_note,
                "order_index": q.order_index,
                "options": options_review,
                "user_selected_option_id": selected_opt_id,
                "user_text_answer": text_ans,
                "is_user_correct": is_correct,
                "marks_awarded": marks_awarded
            })

        attempt.score = round(max(0.0, total_score), 2)
        attempt.correct_count = correct_count
        attempt.incorrect_count = incorrect_count
        attempt.unattempted_count = unattempted_count
        attempt.accuracy_percentage = round((correct_count / max(1, (correct_count + incorrect_count))) * 100, 2)
        db.commit()
        db.refresh(attempt)

        # Log User Activity
        activity = UserActivity(
            user_id=user_id,
            activity_type="quiz_completed",
            title=f"Completed Quiz: {quiz.title}",
            details=f"Score: {attempt.score}/{attempt.total_marks} ({attempt.accuracy_percentage}%)",
            score=attempt.score
        )
        db.add(activity)
        db.commit()

        return {
            "id": attempt.id,
            "quiz_id": attempt.quiz_id,
            "user_id": attempt.user_id,
            "score": attempt.score,
            "total_marks": attempt.total_marks,
            "correct_count": attempt.correct_count,
            "incorrect_count": attempt.incorrect_count,
            "unattempted_count": attempt.unattempted_count,
            "accuracy_percentage": attempt.accuracy_percentage,
            "time_taken_seconds": attempt.time_taken_seconds,
            "completed_at": attempt.completed_at,
            "questions_review": questions_review
        }

quiz_service = QuizService()
