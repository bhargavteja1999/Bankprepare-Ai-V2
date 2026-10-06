from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserOut, UserUpdate
from app.core.dependencies import get_current_user
from app.core.security import get_password_hash
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.target_exam is not None:
        current_user.target_exam = update_data.target_exam
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url
    if update_data.password:
        current_user.hashed_password = get_password_hash(update_data.password)

    db.commit()
    db.refresh(current_user)
    return current_user
