from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.analytics import UserActivity
from app.schemas.document import DocumentOut, DocumentDetail, DocumentCreate
from app.services.document_processor import document_processor
from app.utils.file_utils import save_uploaded_file

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    subject: Optional[str] = Form("Banking Awareness"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save file
    file_path, file_type, file_size = save_uploaded_file(file, settings.UPLOAD_DIR)
    
    # Extract text
    doc_title = title or file.filename or "Uploaded Document"
    extracted_text = document_processor.extract_text_from_file(file_path, file_type)
    processed = document_processor.process_content(extracted_text, doc_title)

    doc = Document(
        user_id=current_user.id,
        title=doc_title,
        file_path=file_path,
        file_type=file_type,
        file_size=file_size,
        word_count=processed["word_count"],
        extracted_text=processed["cleaned_text"],
        summary=processed["summary"],
        subject=subject or "Banking Awareness",
        status="ready"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Activity log
    activity = UserActivity(
        user_id=current_user.id,
        activity_type="doc_uploaded",
        title=f"Uploaded Document: {doc_title}",
        details=f"{doc.word_count} words processed"
    )
    db.add(activity)
    db.commit()

    return DocumentOut(
        id=doc.id,
        title=doc.title,
        subject=doc.subject,
        user_id=doc.user_id,
        file_type=doc.file_type,
        file_size=doc.file_size,
        word_count=doc.word_count,
        summary=doc.summary,
        extracted_text_preview=doc.summary,
        status=doc.status,
        created_at=doc.created_at
    )

@router.post("/text", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def create_text_document(
    doc_in: DocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    raw_text = doc_in.raw_text or ""
    processed = document_processor.process_content(raw_text, doc_in.title)

    doc = Document(
        user_id=current_user.id,
        title=doc_in.title,
        file_type="text",
        file_size=len(raw_text.encode("utf-8")),
        word_count=processed["word_count"],
        extracted_text=processed["cleaned_text"],
        summary=processed["summary"],
        subject=doc_in.subject or "Banking Awareness",
        status="ready"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return DocumentOut(
        id=doc.id,
        title=doc.title,
        subject=doc.subject,
        user_id=doc.user_id,
        file_type=doc.file_type,
        file_size=doc.file_size,
        word_count=doc.word_count,
        summary=doc.summary,
        extracted_text_preview=doc.summary,
        status=doc.status,
        created_at=doc.created_at
    )

@router.get("", response_model=List[DocumentOut])
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    results = []
    for d in docs:
        results.append(DocumentOut(
            id=d.id,
            title=d.title,
            subject=d.subject,
            user_id=d.user_id,
            file_type=d.file_type,
            file_size=d.file_size,
            word_count=d.word_count,
            summary=d.summary,
            extracted_text_preview=d.summary,
            status=d.status,
            created_at=d.created_at
        ))
    return results

@router.get("/{document_id}", response_model=DocumentDetail)
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentDetail(
        id=doc.id,
        title=doc.title,
        subject=doc.subject,
        user_id=doc.user_id,
        file_type=doc.file_type,
        file_size=doc.file_size,
        word_count=doc.word_count,
        summary=doc.summary,
        extracted_text_preview=doc.summary,
        extracted_text=doc.extracted_text,
        status=doc.status,
        created_at=doc.created_at
    )

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return None
