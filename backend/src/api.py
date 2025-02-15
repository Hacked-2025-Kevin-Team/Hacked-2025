from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/")
async def read_root() -> Dict[str, str]:
    """
    Root endpoint that returns a welcome message
    """
    return {"message": "Welcome to the Hacked 2025 API!"}


@router.get("/hello/{name}")
async def greet_user(name: str) -> Dict[str, str]:
    """
    Greets a user by their name
    """
    return {"message": f"Hello, {name}! Welcome to Hacked 2025"}
