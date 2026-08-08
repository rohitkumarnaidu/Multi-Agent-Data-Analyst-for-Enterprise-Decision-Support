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
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma4:12b")
    OLLAMA_FALLBACK_MODEL: str = os.getenv("OLLAMA_FALLBACK_MODEL", "deepseek-r1:8b")

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


class NullLLM:
    """
    Sentinel LLM for Tier 3 (deterministic-only mode).
    Raises a clean RuntimeError that all agents catch and route to their
    deterministic template fallback. Guarantees 100% uptime with zero LLM.
    """
    def invoke(self, prompt, **kwargs):
        raise RuntimeError("[NullLLM] No LLM provider available — using deterministic fallback.")

    def __call__(self, prompt, **kwargs):
        raise RuntimeError("[NullLLM] No LLM provider available — using deterministic fallback.")


def get_llm(provider: str = None, model: str = None, temperature: float = 0.1):
    """
    Factory function returning a LangChain-compatible LLM.

    3-Tier Fallback Chain:
      Tier 1 — Groq    (cloud, fastest):  requires GROQ_API_KEY env var
      Tier 2 — Ollama  (local, offline):  requires Ollama server running locally
      Tier 3 — NullLLM (deterministic):   no LLM at all — agents use rule/template fallback

    Returns a LangChain-compatible LLM or NullLLM sentinel.
    """
    provider = provider or settings.DEFAULT_LLM_PROVIDER

    # ── Tier 1: Groq (Cloud) ──
    if provider in ("groq", "auto"):
        try:
            from langchain_groq import ChatGroq
            api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
            if not api_key:
                raise ValueError("GROQ_API_KEY not set in environment or .env")
            llm = ChatGroq(
                api_key=api_key,
                model=model or settings.GROQ_MODEL,
                temperature=temperature,
                max_retries=2,
            )
            print(f"[LLM] Tier 1 active: Groq ({settings.GROQ_MODEL})")
            return llm
        except Exception as e:
            print(f"[LLM] Tier 1 (Groq) unavailable: {e}")

    # ── Tier 2: Ollama (Local) ──
    if provider in ("ollama", "auto", "groq"):
        try:
            import httpx as _httpx
            # Probe Ollama server health (3s timeout — don't hang)
            resp = _httpx.get(f"{settings.OLLAMA_HOST}/api/tags", timeout=3.0)
            resp.raise_for_status()
            raw_models = resp.json().get("models", [])
            # Keep FULL names including tags (e.g. "gemma4:12b", "deepseek-r1:8b")
            available_full = [m["name"] for m in raw_models]
            available_base = [m["name"].split(":")[0] for m in raw_models]

            # Match preferred models against full name OR base prefix
            preferred_full = [settings.OLLAMA_MODEL, settings.OLLAMA_FALLBACK_MODEL]
            preferred_base = [settings.OLLAMA_MODEL.split(":")[0], settings.OLLAMA_FALLBACK_MODEL.split(":")[0]]

            selected_model = None
            for full, base in zip(preferred_full, preferred_base):
                if full in available_full:
                    selected_model = full  # exact match with tag
                    break
                elif base in available_base:
                    # find the actual full name for this base
                    idx = available_base.index(base)
                    selected_model = available_full[idx]
                    break

            if not selected_model and available_full:
                selected_model = available_full[0]  # first available
            if not selected_model:
                raise ValueError("Ollama running but no models loaded. Pull a model first.")

            # Try langchain-ollama (non-deprecated) first
            try:
                from langchain_ollama import OllamaLLM
                llm = OllamaLLM(base_url=settings.OLLAMA_HOST, model=selected_model, temperature=temperature)
                print(f"[LLM] Tier 2 active: Ollama/{selected_model} (langchain-ollama)")
                return llm
            except ImportError:
                from langchain_community.llms import Ollama
                llm = Ollama(base_url=settings.OLLAMA_HOST, model=selected_model, temperature=temperature)
                print(f"[LLM] Tier 2 active: Ollama/{selected_model} (langchain-community)")
                return llm

        except Exception as e:
            print(f"[LLM] Tier 2 (Ollama) unavailable: {e}")

    # ── Tier 3: NullLLM (Deterministic-only mode) ──
    print("[LLM] Tier 3 active: NullLLM — deterministic-only mode (agents use rule/template fallback)")
    return NullLLM()


def get_fallback_llm(temperature: float = 0.1):
    """Returns the local Ollama LLM (Tier 2), or NullLLM if unavailable."""
    return get_llm(provider="ollama", temperature=temperature)




def ensure_dirs():
    """Create required output directories if they don't exist."""
    settings.OUTPUTS_PATH.mkdir(parents=True, exist_ok=True)
    settings.CHROMA_PERSIST_DIR.mkdir(parents=True, exist_ok=True)


# Auto-create output dirs on import
ensure_dirs()
