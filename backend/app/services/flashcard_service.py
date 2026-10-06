from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from fastapi import HTTPException
from app.models.flashcard import FlashcardDeck, Flashcard
from app.models.analytics import UserActivity

class FlashcardService:
    @staticmethod
    def create_deck_with_cards(
        db: Session,
        user_id: int,
        title: str,
        description: Optional[str],
        subject: str,
        document_id: Optional[int],
        cards_data: List[Dict[str, Any]]
    ) -> FlashcardDeck:
        deck = FlashcardDeck(
            user_id=user_id,
            document_id=document_id,
            title=title,
            description=description,
            subject=subject
        )
        db.add(deck)
        db.commit()
        db.refresh(deck)

        for c in cards_data:
            card = Flashcard(
                deck_id=deck.id,
                front=c.get("front", ""),
                back=c.get("back", ""),
                hint=c.get("hint", "")
            )
            db.add(card)
        db.commit()

        activity = UserActivity(
            user_id=user_id,
            activity_type="flashcard_created",
            title=f"Created Flashcard Deck: {title}",
            details=f"{len(cards_data)} cards in {subject}"
        )
        db.add(activity)
        db.commit()
        db.refresh(deck)
        return deck

    @staticmethod
    def review_card(db: Session, card_id: int, quality: int) -> Flashcard:
        card = db.query(Flashcard).filter(Flashcard.id == card_id).first()
        if not card:
            raise HTTPException(status_code=404, detail="Flashcard not found")

        # Spaced repetition calculation (SM-2 simplified)
        if quality == 0: # Again
            card.mastery_level = max(0, card.mastery_level - 1)
            card.interval_days = 1
        elif quality == 1: # Hard
            card.interval_days = max(1, int(card.interval_days * 1.2))
        elif quality == 2: # Good
            card.mastery_level = min(5, card.mastery_level + 1)
            card.interval_days = max(2, int(card.interval_days * 2.0))
        elif quality >= 3: # Easy
            card.mastery_level = min(5, card.mastery_level + 2)
            card.interval_days = max(3, int(card.interval_days * 3.0))

        card.next_review_date = datetime.now(timezone.utc) + timedelta(days=card.interval_days)
        db.commit()
        db.refresh(card)
        return card

flashcard_service = FlashcardService()
