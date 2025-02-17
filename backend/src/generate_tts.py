import openai
import os
import time
import glob


# OpenAI API Key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Directory where TTS MP3 files will be stored
TTS_AUDIO_DIR = "tts_audio"
os.makedirs(TTS_AUDIO_DIR, exist_ok=True)
os.makedirs(TTS_AUDIO_DIR + "_deleted", exist_ok=True)


def text_to_speech(text, filename):
    """Generate TTS MP3 and save it."""
    response = openai.audio.speech.create(
        model="tts-1",
        voice="sage",  # Change voice if needed
        input=text
    )    
    audio_path = os.path.join(TTS_AUDIO_DIR, filename)

    audio_path_deleted = os.path.join(TTS_AUDIO_DIR + "_deleted", filename)
    with open(audio_path_deleted, "wb") as f:
        f.write(response.content)
    with open(audio_path, "wb") as f:
        f.write(response.content)
    print(f"TTS generated: {audio_path}")




