from fastapi import FastAPI
import uvicorn
from api import router as api_router
from api.llm import LLM  # Import the LLM class

app = FastAPI()

# Initialize the LLM here (only once)
app.state.llm_instance = LLM()

# Include the API router
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
