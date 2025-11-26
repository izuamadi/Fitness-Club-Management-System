"""
Room entity model.
Represents physical spaces in the gym facility.
Stores room details (name, location, capacity) for booking and scheduling purposes.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Room(Base):
    #Table
    __tablename__ = "room"
    
    #Attributes
    room_id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey('adminstaff.admin_id'))  #FK to admin
    room_name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    location = Column(String(100), nullable=False)

    #Relationships
    #N rooms belong to 1 admin
    admin = relationship("AdminStaff", back_populates="rooms")
    #1 room contains N equipment
    equipment = relationship("Equipment", back_populates="room")
    #1 room hosts N group classes
    group_classes = relationship("GroupClass", back_populates="room")
    #1 room hosts N personal training sessions
    personal_training_sessions = relationship("PersonalTrainingSession", back_populates="room")