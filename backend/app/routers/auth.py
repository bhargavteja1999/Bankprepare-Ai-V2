from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import LoginRequest, RegisterRequest
from app.schemas.user import AuthResponse, UserOut
from app.services.auth_service import auth_service
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user, token = auth_service.register(db, request)
    return AuthResponse(user=user, access_token=token, token_type="bearer")

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user, token = auth_service.login(db, request)
    return AuthResponse(user=user, access_token=token, token_type="bearer")

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
