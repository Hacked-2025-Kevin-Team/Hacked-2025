from fastapi import FastAPI
import uvicorn
from api import router as api_router

app = FastAPI()

# Include the API router
app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
