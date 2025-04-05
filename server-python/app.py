from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from pydantic_settings import BaseSettings
from services.ai_service import process_audio_with_ai, get_random_story
from uuid import uuid4

# Configuration using Pydantic
class Settings(BaseSettings):
    # Server Configuration
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = False
    
    # Application Settings
    UPLOAD_FOLDER: str = "uploads"
    ALLOWED_ORIGINS: list = ["*"]  # In production, specify exact origins
    MAX_CONTENT_LENGTH: int = 16777216  # 16MB in bytes
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields from environment

settings = Settings()

app = FastAPI(title="Shadowing Lesson API")

# Configure CORS to allow requests from your React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions
def get_upload_path():
    """Ensure upload directory exists and return it"""
    if not os.path.exists(settings.UPLOAD_FOLDER):
        os.makedirs(settings.UPLOAD_FOLDER)
    return settings.UPLOAD_FOLDER

@app.get("/api/lesson/story")
async def get_story():
    story = await get_random_story("food", "A1")
    return {
        "status": "success",
        "story": story
    }
    
@app.post("/upload-audio")
async def upload_audio(
    audio: UploadFile = File(...),
    upload_path: str = Depends(get_upload_path)
):
    # Generate unique filename based on UUID
    filename = f"{uuid4()}.webm"
    file_path = os.path.join(upload_path, filename)
    
    # Save the uploaded file
    with open(file_path, "wb") as f:
        content = await audio.read()
        f.write(content)
    
    # Process the audio file with AI
    analysis_result = await process_audio_with_ai(file_path)
    
    return {
        'status': 'success',
        'message': 'Audio received and processed successfully',
        'file_path': file_path,
        'analysis': analysis_result
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
