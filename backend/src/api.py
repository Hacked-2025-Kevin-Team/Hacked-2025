from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/")
async def read_root() -> Dict[str, str]:
    """
    Root endpoint that returns a welcome message
    """
    return {"message": "Welcome to the Hacked 2025 API!"}


@router.get("/query")
async def read_query(query: str) -> Dict[str, str]:
    """
    Endpoint that returns the query parameter
    """
    return {"query": query}
