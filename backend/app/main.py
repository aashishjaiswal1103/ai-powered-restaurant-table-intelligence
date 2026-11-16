from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Restaurant Intelligence & Operations System API",
    version="1.0.0",
    description="Operational backend bridging CCTV table occupancy and customer QR ordering.",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to settings.frontend_origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app_env": settings.app_env,
        "database": settings.rushdb_database_id,
        "version": "1.0.0",
    }
