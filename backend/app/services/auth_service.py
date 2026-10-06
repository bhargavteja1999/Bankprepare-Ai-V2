from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest
from app.core.security import verify_password, get_password_hash, create_access_token

class AuthService:
    @staticmethod
    def register(db: Session, request: RegisterRequest) -> tuple[User, str]:
        existing = db.query(User).filter(User.email == request.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists"
            )

        user = User(
            email=request.email,
            hashed_password=get_password_hash(request.password),
            full_name=request.full_name or request.email.split("@")[0],
            target_exam=request.target_exam or "IBPS PO",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(subject=user.id)
        return user, token

    @staticmethod
    def login(db: Session, request: LoginRequest) -> tuple[User, str]:
        user = db.query(User).filter(User.email == request.email).first()
        if not user or not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is inactive"
            )

        token = create_access_token(subject=user.id)
        return user, token

auth_service = AuthService()
