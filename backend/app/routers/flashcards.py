from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.flashcard import FlashcardDeck, Flashcard
from app.models.document import Document
from app.schemas.flashcard import (
    FlashcardDeckOut, FlashcardDeckDetail, FlashcardDeckCreate,
    FlashcardGenerateRequest, FlashcardReviewRequest, FlashcardOut
)
from app.services.ai_generator import ai_generator
from app.services.flashcard_service import flashcard_service

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

@router.post("/generate", response_model=FlashcardDeckDetail, status_code=status.HTTP_201_CREATED)
def generate_flashcards(
    req: FlashcardGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document_text = req.raw_text or ""
    doc_title = req.topic or "Banking Awareness Flashcards"

    if req.document_id:
        doc = db.query(Document).filter(Document.id == req.document_id, Document.user_id == current_user.id).first()
        if doc:
            document_text = doc.extracted_text or doc.summary or ""
            doc_title = doc.title

    cards_data = ai_generator.generate_flashcards(
        document_text=document_text,
        topic=req.topic or doc_title,
        subject=req.subject or "Banking Awareness",
        num_cards=req.num_cards
    )

    deck = flashcard_service.create_deck_with_cards(
        db=db,
        user_id=current_user.id,
        title=f"Deck: {req.topic or doc_title}",
        description=f"Generated spaced-repetition cards for {req.subject}",
        subject=req.subject or "Banking Awareness",
        document_id=req.document_id,
        cards_data=cards_data
    )
    return deck

@router.get("/decks", response_model=List[FlashcardDeckOut])
def list_decks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    decks = db.query(FlashcardDeck).filter(FlashcardDeck.user_id == current_user.id).order_by(FlashcardDeck.created_at.desc()).all()
    results = []
    for d in decks:
        results.append(FlashcardDeckOut(
            id=d.id,
            user_id=d.user_id,
            document_id=d.document_id,
            title=d.title,
            description=d.description,
            subject=d.subject,
            cards_count=len(d.cards),
            created_at=d.created_at
        ))
    return results

@router.get("/decks/{deck_id}", response_model=FlashcardDeckDetail)
def get_deck(
    deck_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id, FlashcardDeck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Flashcard deck not found")
    return deck

@router.post("/cards/{card_id}/review", response_model=FlashcardOut)
def review_card(
    card_id: int,
    req: FlashcardReviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated = flashcard_service.review_card(db, card_id, req.quality)
    return updated

@router.delete("/decks/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(
    deck_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id, FlashcardDeck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    db.delete(deck)
    db.commit()
    return None
