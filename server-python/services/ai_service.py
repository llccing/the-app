import requests
import os
import logging
import asyncio
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables for API keys
load_dotenv()

class Settings(BaseSettings):
    UNI_API_KEY: str = "default_value"
    UNI_API_BASE_URL: str = "https://api.uniapi.io/v1"
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields from environment

settings = Settings()

def get_openai_client():
    """Get a configured OpenAI client with API key and base URL"""
    api_key = settings.UNI_API_KEY
    base_url = settings.UNI_API_BASE_URL
    
    return OpenAI(
        api_key=api_key,
        base_url=base_url
    )

async def get_random_story(base: str, level: str):
    prompt = f'''Generate a very short story (around 50-70 words) for an A1 English learner about a special meal. 
        Use simple present and past tense verbs (like 'is', 'eat', 'like', 'was', 'ate'), basic adjectives (like 'happy', 'good', 'big'), 
        and common food words. The story should describe what the meal was (e.g., 'big pizza', 'good soup') 
        and who the person ate with (e.g., 'my family', 'my friend'). Keep sentences very simple."
    '''
    
    client = get_openai_client()
    
    response = await asyncio.to_thread(
        client.chat.completions.create,
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content

async def process_audio_with_ai(audio_file_path):
    """
    Process an audio file with OpenAI's Whisper API and return scoring information.
    """
    try:
        client = get_openai_client()
        
        logger.info(f"Processing audio file: {audio_file_path}")
        logger.info(f"Using API base URL: {settings.UNI_API_BASE_URL}")
        
        with open(audio_file_path, "rb") as audio_file:
            # Call OpenAI Whisper API
            logger.info("Sending request to Whisper API...")
            # Run the API call in a thread pool to avoid blocking
            response = await asyncio.to_thread(
                client.audio.transcriptions.create,
                model="whisper-1",
                file=audio_file
            )
            
            logger.info("Received response from Whisper API")
            logger.debug(f"API Response: {response}")
            
            # Process the transcription and generate feedback
            transcription = response.text
            
            # For now, return mock data with the transcription
            return {
                # "score": 85,  # Example score out of 100
                # "feedback": "Good pronunciation overall. Work on intonation.",
                # "details": {
                #     "pronunciation": 90,
                #     "fluency": 80,
                #     "intonation": 75
                # },
                "transcription": transcription
            }
    
    except Exception as e:
        logger.error(f"Error processing audio with AI: {str(e)}", exc_info=True)
        return {
            "score": 0,
            "feedback": "Failed to process audio",
            "error": str(e)
        }
