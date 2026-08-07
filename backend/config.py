"""
Centralized Configuration — Multi-Agent Data Analyst
=====================================================
Loads settings from .env file and provides factory functions
for LLM clients, paths, and application-wide constants.

Usage:
    from backend.config import settings, get_llm
    llm = get_llm()  # returns configured LangChain LLM
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ── Resolve project root ──
PROJECT_ROOT = Path(__file__).parent.parent.resolve()
ENV_PATH = PROJECT_ROOT / ".env"

# Load .env (if exists, otherwise use system env vars)
load_dotenv(dotenv_path=ENV_PATH, override=False)


class Settings:
    """Application settings loaded from environment variables."""

    # ── Project Paths ──
    PROJECT_ROOT: Path = PROJECT_ROOT
    DATA_PATH: Path = PROJECT_ROOT / os.getenv("DATA_PATH", "data/cleaned_enterprise_multiagent_decision_support.csv")
    RAW_DATA_PATH: Path = PROJECT_ROOT / os.getenv("RAW_DATA_PATH", "data/raw/enterprise_multiagent_decision_support.csv")
    OUTPUTS_PATH: Path = PROJECT_ROOT / os.getenv("OUTPUTS_PATH", "outputs")
    CHROMA_PERSIST_DIR: Path = PROJECT_ROOT / os.getenv("CHROMA_PERSIST_DIR", ".chroma_db")

    # ── LLM Provider ──
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "groq")

    # ── Groq (Cloud LLM) ──
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")

    # ── Ollama (Local Fallback) ──
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma3:12b")
    OLLAMA_FALLBACK_MODEL: str = os.getenv("OLLAMA_FALLBACK_MODEL", "deepseek-r1")

    # ── Safety Limits (from 06-evaluation doc) ──
    MAX_STEPS_PER_QUESTION: int = 8
    CLASSIFICATION_TIMEOUT_SEC: float = 5.0
    QUERY_EXECUTION_TIMEOUT_SEC: float = 8.0
    SMALL_SAMPLE_THRESHOLD: int = 30

    # ── DuckDB ──
    DUCKDB_TABLE_NAME: str = "enterprise_data"

    # ── Application ──
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # ── Reference Date ──
    # Set dynamically after data load; max(Transaction_Date) in the dataset
    REFERENCE_DATE: str = "2025-12-30"

    # ── PII Columns (auto-excluded from narrative generation) ──
    PII_COLUMNS: list = ["Employee_ID_Handler"]

    def __repr__(self) -> str:
        return (
            f"Settings(\n"
            f"  provider={self.DEFAULT_LLM_PROVIDER},\n"
            f"  groq_model={self.GROQ_MODEL},\n"
            f"  ollama_model={self.OLLAMA_MODEL},\n"
            f"  data_path={self.DATA_PATH},\n"
            f"  max_steps={self.MAX_STEPS_PER_QUESTION}\n"
            f")"
        )


# Singleton instance
settings = Settings()


def get_llm(provider: str = None, model: str = None, temperature: float = 0.1):
    """
    Factory function returning a LangChain-compatible LLM.

    Provider priority:
      1. Explicit provider argument
      2. settings.DEFAULT_LLM_PROVIDER from .env
      3. Fallback chain: groq -> ollama

    Returns a LangChain BaseChatModel instance.
    """
    provider = provider or settings.DEFAULT_LLM_PROVIDER

    if provider == "groq":
        try:
            from langchain_groq import ChatGroq
            if not settings.GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY not set")
            return ChatGroq(
                api_key=settings.GROQ_API_KEY,
                model=model or settings.GROQ_MODEL,
                temperature=temperature,
                max_retries=2,
            )
        except (ImportError, ValueError) as e:
            print(f"[CONFIG] Groq unavailable ({e}), falling back to Ollama...")
            return get_llm(provider="ollama", model=model, temperature=temperature)

    elif provider == "ollama":
        try:
            from langchain_community.llms import Ollama
            return Ollama(
                base_url=settings.OLLAMA_HOST,
                model=model or settings.OLLAMA_MODEL,
                temperature=temperature,
            )
        except ImportError:
            # Last resort: try the fallback model
            from langchain_community.llms import Ollama
            return Ollama(
                base_url=settings.OLLAMA_HOST,
                model=settings.OLLAMA_FALLBACK_MODEL,
                temperature=temperature,
            )

    else:
        raise ValueError(f"Unknown LLM provider: {provider}. Use 'groq' or 'ollama'.")


def get_fallback_llm(temperature: float = 0.1):
    """
    Returns the local fallback LLM (Ollama).
    Used when the primary cloud LLM fails.
    """
    return get_llm(provider="ollama", temperature=temperature)


def ensure_dirs():
    """Create required output directories if they don't exist."""
    settings.OUTPUTS_PATH.mkdir(parents=True, exist_ok=True)
    settings.CHROMA_PERSIST_DIR.mkdir(parents=True, exist_ok=True)


# Auto-create output dirs on import
ensure_dirs()
