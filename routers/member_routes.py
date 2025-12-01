"""
Member API routes - REST endpoints for member operations.
Exposes HTTP endpoints for member registration, profile updates, health metrics, dashboard, and class registration.
Handles request validation and response formatting for member-facing features.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, OperationalError
from typing import List

from core.database import get_db
from schemas.member_schemas import MemberCreate, MemberUpdate, MemberResponse
from model.member import Member
import repositories.member_repository as member_repo

router = APIRouter(prefix="/member", tags=["Member"])

# -----------------------------
# CREATE MEMBER
# -----------------------------
@router.post("/", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(member: MemberCreate, db: Session = Depends(get_db)):
    """Create a new member"""
    try:
        # Check if email already exists
        existing = member_repo.get_member_by_email(db, member.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        new_member = Member(**member.dict())
        return member_repo.create_member(db, new_member)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error. Email may already exist."
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

# -----------------------------
# GET MEMBER BY ID
# -----------------------------
@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    """Get member by ID"""
    try:
        member = member_repo.get_member_by_id(db, member_id)
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )
        return member
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

# -----------------------------
# GET MEMBER BY EMAIL
# -----------------------------
@router.get("/email/{email}", response_model=MemberResponse)
def get_member_by_email(email: str, db: Session = Depends(get_db)):
    """Get member by email address"""
    try:
        member = member_repo.get_member_by_email(db, email)
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )
        return member
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

# -----------------------------
# LIST ALL MEMBERS
# -----------------------------
@router.get("/", response_model=List[MemberResponse])
def list_members(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all members with pagination"""
    try:
        return member_repo.get_all_members(db, skip=skip, limit=limit)
    except OperationalError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection error. Please check your database configuration in .env file."
        )
    except SQLAlchemyError as e:
        error_msg = str(e)
        if "no password supplied" in error_msg or "connection" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection failed. Please configure your database credentials in .env file."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {error_msg}"
        )

# -----------------------------
# UPDATE MEMBER
# -----------------------------
@router.put("/{member_id}", response_model=MemberResponse)
def update_member(member_id: int, member_update: MemberUpdate, db: Session = Depends(get_db)):
    """Update member information"""
    try:
        # Check if email is being changed and verify uniqueness
        if member_update.email:
            existing = member_repo.get_member_by_email(db, member_update.email)
            if existing and existing.member_id != member_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered to another member"
                )
        
        updated = member_repo.update_member(
            db, 
            member_id,
            name=member_update.name,
            email=member_update.email,
            date_of_birth=member_update.date_of_birth,
            gender=member_update.gender,
            phone=member_update.phone
        )
        
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )
        return updated
    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

# -----------------------------
# DELETE MEMBER
# -----------------------------
@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    """Delete a member"""
    try:
        success = member_repo.delete_member(db, member_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
