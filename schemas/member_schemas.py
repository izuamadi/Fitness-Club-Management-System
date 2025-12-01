"""
Member request/response schemas - data validation and serialization.
Defines Pydantic models for member-related API requests and responses.
Validates input data and formats output for member endpoints.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class MemberBase(BaseModel):
    """Base schema for Member"""
    name: str
    email: EmailStr
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None

class MemberCreate(MemberBase):
    """Schema for creating a new member"""
    pass

class MemberUpdate(BaseModel):
    """Schema for updating member"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None

class MemberResponse(MemberBase):
    """Schema for member response"""
    member_id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True  # Allows Pydantic to read from ORM models
