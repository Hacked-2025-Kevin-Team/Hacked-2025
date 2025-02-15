import asyncio
from fastapi import APIRouter
from typing import Dict
from fastapi.responses import EventSourceResponse

router = APIRouter()


@router.get("/")
async def read_root() -> Dict[str, str]:
    """
    Root endpoint that returns a welcome message
    """
    return {"message": "Welcome to the Hacked 2025 API!"}


@router.get("/summarize")
async def search(query: str) -> Dict[str, str]:
    """
    Search endpoint that returns a mock response
    """
    return {
        "summary": "This is a summary of the search result",
        "title": "Search Result Title",
        "url": "https://example.com/search-result",
    }


async def event_stream():
    for i in range(10):  # Simulating a stream of responses
        await asyncio.sleep(1)  # Simulate delay
        yield f"data: Response {i}\n\n"


@router.get("/chat-stream")
async def chat_stream():
    return EventSourceResponse(event_stream())
