from fastapi import FastAPI
from typing import Dict
import uvicorn
app = FastAPI()


@app.get("/")
async def read_root() -> Dict[str, str]:
    """
    Root endpoint that returns a welcome message
    """ 
    return {"message": "Welcome to the Hacked 2025 API!"}


@app.get("/hello/{name}")
async def greet_user(name: str) -> Dict[str, str]:
    """
    Greets a user by their name
    """
    return {"message": f"Hello, {name}! Welcome to Hacked 2025"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
