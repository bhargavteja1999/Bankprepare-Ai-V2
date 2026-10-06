from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    target_exam: Optional[str] = "IBPS PO"
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    target_exam: Optional[str] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"
