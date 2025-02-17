

from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
import os
import random
import time
from mutagen.mp3 import MP3
import asyncio

app = FastAPI()

AUDIO_DIR = "audio_files"
current_track = {"title": "", "filename": ""}

async def stream_audio(file_path):
    """ Generator function to stream audio in chunks """
    with open(file_path, "rb") as audio_file:
        while chunk := audio_file.read(4096):
            yield chunk

@app.get("/radio")
async def radio_stream():
    """ Streams a random MP3 file continuously """
    while True:
        files = [f for f in os.listdir(AUDIO_DIR) if f.endswith(".mp3")]
        if not files:
            return Response("No MP3 files found", status_code=404)

        random_file = random.choice(files)
        file_path = os.path.join(AUDIO_DIR, random_file)

        # Get MP3 duration
        audio = MP3(file_path)
        duration = int(audio.info.length)

        # Update current track info
        global current_track
        current_track = {"title": random_file, "filename": f"/play/{random_file}"}

        # Notify clients about the new track
        await broadcast_track_update()

        # Stream the file
        return StreamingResponse(stream_audio(file_path), media_type="audio/mpeg")

@app.get("/play/{filename}")
async def play_audio(filename: str):
    """ Stream a specific MP3 file """
    file_path = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(file_path):
        return Response("File not found", status_code=404)
    return StreamingResponse(stream_audio(file_path), media_type="audio/mpeg")

@app.get("/current-track")
async def get_current_track():
    """ Returns the currently playing track """
    return current_track

@app.get("/track-updates")
async def track_updates():
    """ SSE endpoint for real-time track updates """
    async def event_generator():
        while True:
            yield {"event": "update", "data": current_track}
            await asyncio.sleep(1)
    return EventSourceResponse(event_generator())

async def broadcast_track_update():
    """ Notifies frontend about track changes """
    async def event_generator():
        yield {"event": "update", "data": current_track}
    return EventSourceResponse(event_generator())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
