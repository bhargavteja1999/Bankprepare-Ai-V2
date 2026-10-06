from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from app.models.quiz import Quiz, QuizAttempt
from app.models.flashcard import Flashcard, FlashcardDeck
from app.models.analytics import UserActivity
from app.models.syllabus import SyllabusSubject, SyllabusTopic, UserTopicProgress

class AnalyticsService:
    @staticmethod
    def get_dashboard_summary(db: Session, user_id: int) -> Dict[str, Any]:
        attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
        total_quizzes = len(attempts)
        
        total_score = sum(a.score for a in attempts)
        total_max = sum(a.total_marks for a in attempts)
        avg_accuracy = round((total_score / max(1.0, total_max)) * 100, 1) if total_max > 0 else 0.0

        total_questions = sum((a.correct_count + a.incorrect_count + a.unattempted_count) for a in attempts)
        total_study_secs = sum(a.time_taken_seconds for a in attempts)
        total_study_minutes = max(1, total_study_secs // 60) if total_quizzes > 0 else 0

        # Mastered flashcards
        mastered_cards = (
            db.query(Flashcard)
            .join(FlashcardDeck)
            .filter(FlashcardDeck.user_id == user_id, Flashcard.mastery_level >= 3)
            .count()
        )

        # Recent activities
        recent_acts = (
            db.query(UserActivity)
            .filter(UserActivity.user_id == user_id)
            .order_by(UserActivity.created_at.desc())
            .limit(8)
            .all()
        )

        # Subject breakdown
        subject_data = {}
        for a in attempts:
            sub = a.quiz.subject if a.quiz else "General"
            if sub not in subject_data:
                subject_data[sub] = {"correct": 0, "total": 0, "quizzes": 0}
            subject_data[sub]["correct"] += a.correct_count
            subject_data[sub]["total"] += (a.correct_count + a.incorrect_count)
            subject_data[sub]["quizzes"] += 1

        subject_performances = []
        for sub_name, stats in subject_data.items():
            acc = round((stats["correct"] / max(1, stats["total"])) * 100, 1)
            subject_performances.append({
                "subject": sub_name,
                "accuracy_percentage": acc,
                "quizzes_taken": stats["quizzes"],
                "total_questions": stats["total"]
            })

        # Recent score trends
        score_trends = []
        for idx, a in enumerate(attempts[-7:]):
            score_trends.append({
                "name": f"Quiz {idx + 1}",
                "score": a.score,
                "total": a.total_marks,
                "accuracy": a.accuracy_percentage,
                "date": a.completed_at.strftime("%b %d") if a.completed_at else ""
            })

        return {
            "total_quizzes_taken": total_quizzes,
            "average_accuracy": avg_accuracy,
            "total_questions_solved": total_questions,
            "total_study_minutes": total_study_minutes,
            "streak_days": min(7, max(1, total_quizzes)),
            "flashcards_mastered": mastered_cards,
            "recent_activities": recent_acts,
            "subject_performances": subject_performances,
            "score_trends": score_trends
        }

analytics_service = AnalyticsService()
