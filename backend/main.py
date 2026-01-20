# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. IMPORT THIS
from .routes import github, resume

# Create an instance of the FastAPI class
app = FastAPI(
    title="GitHub Resume Sync API",
    description="Backend service for the GitHub Resume Sync browser extension.",
    version="1.0.0"
)

# --- 2. DEFINE YOUR ORIGINS AND ADD THE MIDDLEWARE (ADD THIS ENTIRE BLOCK) ---

# Allow all origins for local development
# In production, you should specify exact extension IDs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- END OF THE NEW BLOCK ---


# A simple root endpoint to verify that the server is running correctly.
@app.get("/")
def read_root():
    """
    Root endpoint to confirm the API is running.
    """
    return {"message": "Welcome to the GitHub Resume Sync Backend!"}


# Include the routers
app.include_router(
    github.router,
    prefix="/api",
    tags=["GitHub"]
)

app.include_router(
    resume.router,
    prefix="/api",
    tags=["Resume"]
)