"""
Application configuration settings.
Manages database connection strings, environment variables, and app-wide settings.
Separates configuration from code for different environments (dev, test, prod).
"""
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_HOST = os.getenv("DATABASE_HOST", "127.0.0.1")
DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")
DATABASE_NAME = os.getenv("DATABASE_NAME", "fitness_club_db")
DATABASE_USER = os.getenv("DATABASE_USER", "postgres")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "050507")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
)
