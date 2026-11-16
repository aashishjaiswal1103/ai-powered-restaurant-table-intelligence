from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    debug: bool = True
    api_host: str = "127.0.0.1"
    api_port: int = 8000

    rushdb_api_key: str = ""
    rushdb_base_url: str = "https://api.rushdb.com"
    rushdb_database_id: str = "restaurant_ops_dev"

    camera_source_type: str = "file"
    camera_source: str = "vision/test_assets/sample_restaurant.mp4"
    vision_model_path: str = "yolov8n.pt"
    vision_confidence_threshold: float = 0.40
    vision_frame_rate: int = 5

    arrival_confirmation_seconds: int = 5
    departure_confirmation_seconds: int = 30

    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
