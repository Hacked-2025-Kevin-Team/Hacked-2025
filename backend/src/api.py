import asyncio
from fastapi import APIRouter, FastAPI
from typing import List, Optional, Dict
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# No need to import llm.llm here

router = APIRouter()

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
    return StreamingResponse(llm_instance.stream_graph_updates(usr_input))
