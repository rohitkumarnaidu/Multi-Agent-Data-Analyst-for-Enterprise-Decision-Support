from datetime import datetime

def current_utc_time() -> str:
    return datetime.utcnow().isoformat()
