"""
Main application entry point.
Initializes the FastAPI/Flask application, registers routes, sets up database connection, and starts the server.
Coordinates all application components and serves as the entry point for running the app.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app instance
app = FastAPI(
    title="Fitness Center Management API",
    description="API for managing fitness center operations",
    version="1.0.0"
)

# Add CORS middleware (allows frontend to communicate with backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
def root():
    """Root endpoint - returns API information"""
    return {
        "message": "Fitness Center Management API",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# TODO: Register routers here
# from routers import member_routes, trainer_routes, admin_routes
# app.include_router(member_routes.router, prefix="/api/members", tags=["Members"])
# app.include_router(trainer_routes.router, prefix="/api/trainers", tags=["Trainers"])
# app.include_router(admin_routes.router, prefix="/api/admin", tags=["Admin"])