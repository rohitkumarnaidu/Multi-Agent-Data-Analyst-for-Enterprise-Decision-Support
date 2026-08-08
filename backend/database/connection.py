import duckdb
from core.config import settings
import structlog

logger = structlog.get_logger("enterprise_backend")

class DatabaseManager:
    def __init__(self):
        self.duckdb_conn = None
        
    def connect_duckdb(self):
        try:
            self.duckdb_conn = duckdb.connect(settings.DUCKDB_PATH, read_only=True) if settings.DUCKDB_PATH != ":memory:" else duckdb.connect()
            logger.info("DuckDB connected successfully.")
        except Exception as e:
            logger.error(f"Failed to connect DuckDB: {e}")
            raise
            
    def get_duckdb_conn(self):
        return self.duckdb_conn
        
db_manager = DatabaseManager()
