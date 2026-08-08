from typing import Optional, List
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Datasphere 26 Enterprise Backend"
    VERSION: str = "6.0.0-alpha"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # CORS
    @computed_field
    @property
    def CORS_ORIGINS(self) -> List[str]:
        if self.ENVIRONMENT == "production":
            return ["https://enterprise.datasphere.internal"] # Example production domain
        elif self.ENVIRONMENT == "testing":
            return ["http://localhost:3000", "http://testserver"]
        return ["*"] # Development

    # Compression
    COMPRESSION_MIN_SIZE: int = 500
    COMPRESSION_LEVEL: int = 6
    
    # Secrets & Security
    SECRET_KEY: str = "placeholder_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Paths
    DUCKDB_PATH: str = ":memory:" # Will read CSV directly
    SQLITE_PATH: str = "sqlite+aiosqlite:///./backend_state.db"
    
    # Model Artifacts
    MODEL_PATH: str = "../models/champion_model.joblib"
    METADATA_PATH: str = "../phase5/production_dataset/training_dataset_metadata.json"
    
    # Conditional Deployment Flags
    COND_001_THRESHOLD: float = 0.05
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
