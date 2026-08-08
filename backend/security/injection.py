"""
Prompt and SQL Injection detection heuristic logic.
"""
import re
import structlog
from exceptions import SecurityException

logger = structlog.get_logger("enterprise_backend.security.injection")

PROMPT_INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"you are now a",
    r"forget everything",
    r"bypass standard protocols",
    r"system prompt:",
    r"act as an uncensored",
]

SQL_INJECTION_PATTERNS = [
    r"DROP TABLE",
    r"TRUNCATE TABLE",
    r"--",
    r"1=1",
    r"UNION ALL SELECT",
    r"EXEC\s*\(",
]

def check_prompt_injection(text: str) -> None:
    if not text:
        return
    text_lower = text.lower()
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text_lower):
            logger.error("Prompt injection detected", pattern=pattern)
            raise SecurityException(f"Potential prompt injection detected matching pattern: {pattern}")
            
def check_sql_injection(text: str) -> None:
    if not text:
        return
    text_upper = text.upper()
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, text_upper):
            logger.error("SQL injection detected", pattern=pattern)
            raise SecurityException(f"Potential SQL injection detected matching pattern: {pattern}")
