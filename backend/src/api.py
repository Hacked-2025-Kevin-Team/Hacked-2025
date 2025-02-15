import asyncio
from fastapi import APIRouter
from typing import Dict
from fastapi.responses import StreamingResponse

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


@router.get("/suggested")
async def suggested() -> Dict[str, str]:
    """
    Returns a list of suggested papers
    """
    return {
        "suggested": [
            {
                "summary": "This groundbreaking paper explores the phenomenon of quantum entanglement in larger, macroscopic systems, challenging our understanding of quantum mechanics at scale.",
                "title": "Quantum Entanglement in Macroscopic Systems",
                "url": "https://example.com/search-result",
                "tags": ["physics"],
                "insights": [
                    "Demonstration of entanglement in systems containing millions of particles",
                    "Potential applications in quantum computing and communication",
                    "New theoretical framework for understanding macroscopic quantum phenomena",
                ],
                "warning": None,
            },
            {
                "summary": "This paper presents a novel approach to detecting exoplanets using machine learning algorithms, demonstrating the potential for automated planet discovery.",
                "title": "Automated Exoplanet Detection Using Machine Learning",
                "url": "https://example.com/search-result",
                "tags": ["astronomy", "machine learning"],
                "insights": [
                    "Development of machine learning models for exoplanet detection",
                    "Improved efficiency and accuracy in identifying exoplanets",
                    "Potential for discovering new exoplanets in existing data sets",
                ],
                "warning": None,
            },
            {
                "summary": "This paper investigates the impact of climate change on global food security, highlighting the need for sustainable agricultural practices and policy interventions.",
                "title": "Climate Change and Global Food Security",
                "url": "https://example.com/search-result",
                "tags": ["climate change", "agriculture"],
                "insights": [
                    "Analysis of climate change effects on crop yields and food production",
                    "Recommendations for sustainable agriculture and food policy",
                    "Implications for global food security and future food systems",
                ],
                "warning": "Contains graphic content",
            },
        ]
    }


async def event_stream():
    for i in range(10):  # Simulating a stream of responses
        await asyncio.sleep(1)  # Simulate delay
        yield f"data: Response {i}\n\n"


@router.get("/chat-stream")
async def chat_stream():
    return StreamingResponse(event_stream())
