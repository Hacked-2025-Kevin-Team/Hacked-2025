import asyncio
import json
from fastapi import APIRouter, FastAPI
from typing import List, Optional, Dict
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from pubmeta import fetch_medical_documments
from fastapi import Response
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
import os
from typing import AsyncGenerator
import random
import time
from mutagen.mp3 import MP3
import asyncio

from fetch_news import fetch_article_pmid, fetch_latest_websites, get_article_data
# No need to import llm.llm here
import time
router = APIRouter()



AUDIO_DIR = "./src/audio_files"
current_track = {"title": "", "filename": ""}

from llm.llm import LLM

llm_instance = LLM()


# Define Pydantic models
class Paper(BaseModel):
    summary: str
    title: str
    url: str
    tags: List[str]
    insights: List[str]
    warning: Optional[str] = None


class SuggestedResponse(BaseModel):
    suggested: List[Paper]


@router.get("/", response_model=Dict[str, str])
async def read_root() -> Dict[str, str]:
    """
    Root endpoint that returns a welcome message
    """
    return {"message": "Welcome to the Hacked 2025 API!"}


@router.get("/summarize", response_model=Dict[str, str])
async def search(query: str) -> Dict[str, str]:
    """
    Summarizes paper results based on the query
    """
    return {
        "summary": "This is a summary of the search result",
        "title": "Search Result Title",
        "url": "https://example.com/search-result",
        "tags": ["tag1", "tag2", "tag3"],
        "insights": ["insight1", "insight2", "insight3"],
        "warning": None,
    }


@router.get("/suggested", response_model=SuggestedResponse)
async def suggested() -> SuggestedResponse:
    """
    Returns a list of suggested papers
    """
    return SuggestedResponse(
        suggested=[
            Paper(
                summary="This groundbreaking paper explores the phenomenon of quantum entanglement in larger, macroscopic systems, challenging our understanding of quantum mechanics at scale.",
                title="Quantum Entanglement in Macroscopic Systems",
                url="https://example.com/search-result",
                tags=["physics"],
                insights=[
                    "Demonstration of entanglement in systems containing millions of particles",
                    "Potential applications in quantum computing and communication",
                    "New theoretical framework for understanding macroscopic quantum phenomena",
                ],
                warning=None,
            ),
            Paper(
                summary="This paper presents a novel approach to detecting exoplanets using machine learning algorithms, demonstrating the potential for automated planet discovery.",
                title="Automated Exoplanet Detection Using Machine Learning",
                url="https://example.com/search-result",
                tags=["astronomy", "machine learning"],
                insights=[
                    "Development of machine learning models for exoplanet detection",
                    "Improved efficiency and accuracy in identifying exoplanets",
                    "Potential for discovering new exoplanets in existing data sets",
                ],
                warning=None,
            ),
            Paper(
                summary="This paper investigates the impact of climate change on global food security, highlighting the need for sustainable agricultural practices and policy interventions.",
                title="Climate Change and Global Food Security",
                url="https://example.com/search-result",
                tags=["climate change", "agriculture"],
                insights=[
                    "Analysis of climate change effects on crop yields and food production",
                    "Recommendations for sustainable agriculture and food policy",
                    "Implications for global food security and future food systems",
                ],
                warning="Contains graphic content",
            ),
        ]
    )


@router.get("/chat-stream")
async def chat_stream(usr_input: str):  # Add app: FastAPI
    """
    Streams chat responses using the shared LLM instance.
    """
    #fetch_medical_documments(usr_input)
    return StreamingResponse(llm_instance.stream_graph_updates(usr_input))


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint
    """
    return JSONResponse(content={"status": "ok"}, status_code=200)


@router.get("/get_news")
async def get_news():

    og_website = "https://pubmed.ncbi.nlm.nih.gov"

    start = time.time()
    data = get_article_data(5)

    data = [{"name": "Latest papers",
            "papers": data}]
    end = time.time()
    print(end - start)
    return JSONResponse(content = data, status_code=200)

async def stream_audio(file_path):
    """ Generator function to stream audio in chunks """
    with open(file_path, "rb") as audio_file:
        while chunk := audio_file.read(4096):
            yield chunk

@router.get("/radio")
async def radio_stream():
    """ Streams a random MP3 file continuously """
    return StreamingResponse(play_next_track(), media_type="audio/mpeg")

@router.get("/play/{filename}")
async def play_audio(filename: str):
    """ Stream a specific MP3 file """
    file_path = os.path.join(AUDIO_DIR, filename)
    if not os.path.exists(file_path):
        return Response("File not found", status_code=404)
    return StreamingResponse(stream_audio(file_path), media_type="audio/mpeg")

@router.get("/current-track")
async def get_current_track():
    """ Returns the currently playing track """
    return current_track

@router.get("/track-updates")
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

async def play_next_track() -> AsyncGenerator[bytes, None]:
    """ Selects a random track and continuously streams it """
    while True:
        files = [f for f in os.listdir(AUDIO_DIR) if f.endswith(".mp3")]
        if not files:
            break

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

        # Stream the audio file using `async for`
        async for chunk in stream_audio(file_path):
            yield chunk

        # Wait for the track to finish before switching
        await asyncio.sleep(duration)