"""
PII Detection and Masking.
"""
import re
import structlog

logger = structlog.get_logger("enterprise_backend.security.pii")

PII_PATTERNS = {
    "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
    "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
    "CREDIT_CARD": r"\b(?:\d[ -]*?){13,16}\b"
}

def mask_pii(text: str) -> str:
    """Replaces PII patterns with [REDACTED_TYPE]."""
    if not text:
        return text
        
    masked_text = text
    redaction_count = 0
    
    for pii_type, pattern in PII_PATTERNS.items():
        matches = re.findall(pattern, masked_text)
        if matches:
            redaction_count += len(matches)
            masked_text = re.sub(pattern, f"[REDACTED_{pii_type}]", masked_text)
            
    if redaction_count > 0:
        logger.info("PII Masking applied", redaction_count=redaction_count)
        
    return masked_text
