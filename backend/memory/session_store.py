"""
Session Store for conversational metadata tracking (Long Term Memory auxiliary).
"""
import sqlite3
import json
import os
import structlog
from typing import Dict, Any, List

logger = structlog.get_logger("enterprise_backend.memory.session_store")

class SQLiteSessionStore:
    def __init__(self, db_path: str = ".memory.db"):
        self.db_path = os.path.abspath(db_path)
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    metadata TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()

    def update_session(self, session_id: str, metadata: Dict[str, Any]):
        """Upsert session metadata."""
        logger.info("Updating session metadata", session_id=session_id)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT metadata FROM sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            
            if row:
                current = json.loads(row[0])
                current.update(metadata)
                cursor.execute('''
                    UPDATE sessions SET metadata = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE session_id = ?
                ''', (json.dumps(current), session_id))
            else:
                cursor.execute('''
                    INSERT INTO sessions (session_id, metadata)
                    VALUES (?, ?)
                ''', (session_id, json.dumps(metadata)))
            conn.commit()

    def get_session(self, session_id: str) -> Dict[str, Any]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT metadata FROM sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row[0])
            return {}
