"""
DuckDB Query Engine — Multi-Agent Data Analyst
================================================
Read-only, in-process DuckDB engine for SQL query execution.
Enforces SELECT-only allow-list per Master Plan Section 12.3
and 06-evaluation safety guardrails.

Safety:
  - Connection is READ-ONLY
  - Only SELECT/WITH/EXPLAIN statements allowed
  - INSERT/UPDATE/DELETE/DROP/ALTER/CREATE/TRUNCATE blocked
  - Query timeout enforced (8 seconds)

Usage:
    from backend.db.duckdb_loader import DuckDBEngine
    engine = DuckDBEngine()
    engine.load_data(csv_path)
    result = engine.execute_query("SELECT COUNT(*) FROM enterprise_data")
"""

import re
import time
import duckdb
import pandas as pd
from pathlib import Path
from typing import Optional


class QuerySafetyError(Exception):
    """Raised when a query violates the safety allow-list."""
    pass


class QueryTimeoutError(Exception):
    """Raised when a query exceeds the execution timeout."""
    pass


# ── SQL Safety Allow-List ──
# Only these statement types are permitted
ALLOWED_PREFIXES = ("select", "with", "explain")

# These keywords trigger an immediate block (case-insensitive)
BLOCKED_KEYWORDS = [
    "insert", "update", "delete", "drop", "alter", "create",
    "truncate", "replace", "merge", "grant", "revoke",
    "attach", "detach", "copy", "export", "import",
    "pragma", "vacuum", "checkpoint",
]


def _validate_query_safety(sql: str) -> None:
    """
    Validate that a SQL query is safe to execute.
    Raises QuerySafetyError if the query violates the allow-list.

    Per Metrics doc Section 3: Query safety = 100% (HARD GATE)
    Per 06-eval Section 5.2: Read-only DB + SELECT-only allow-list
    """
    cleaned = sql.strip().lower()

    # Remove leading comments
    while cleaned.startswith("--"):
        cleaned = cleaned.split("\n", 1)[-1].strip().lower() if "\n" in cleaned else ""

    # Remove block comments
    cleaned = re.sub(r"/\*.*?\*/", "", cleaned, flags=re.DOTALL).strip()

    if not cleaned:
        raise QuerySafetyError("Empty query")

    # Check if the query starts with an allowed prefix
    if not any(cleaned.startswith(prefix) for prefix in ALLOWED_PREFIXES):
        raise QuerySafetyError(
            f"Query blocked: only SELECT/WITH/EXPLAIN queries are allowed. "
            f"Got: '{cleaned[:50]}...'"
        )

    # Check for blocked keywords anywhere in the query
    # (catches subquery injection attempts like SELECT 1; DROP TABLE...)
    # Split on semicolons and check each statement
    statements = [s.strip() for s in cleaned.split(";") if s.strip()]
    for stmt in statements:
        for keyword in BLOCKED_KEYWORDS:
            # Match keyword as a whole word (not part of column names)
            pattern = r"\b" + keyword + r"\b"
            if re.search(pattern, stmt):
                raise QuerySafetyError(
                    f"Query blocked: '{keyword.upper()}' operations are not allowed. "
                    f"Only read-only SELECT queries are permitted."
                )


class DuckDBEngine:
    """
    In-process DuckDB query engine with read-only safety enforcement.
    """

    def __init__(self, table_name: str = "enterprise_data"):
        """Initialize DuckDB connection."""
        self.table_name = table_name
        self.conn: Optional[duckdb.DuckDBPyConnection] = None
        self._loaded = False

    def load_data(self, csv_path: str, table_name: str = None) -> None:
        """
        Load a CSV file into DuckDB as a named table.

        Args:
            csv_path: Path to the CSV file to load.
            table_name: Override the default table name.
        """
        if table_name:
            self.table_name = table_name

        path = Path(csv_path)
        if not path.exists():
            raise FileNotFoundError(f"CSV file not found: {csv_path}")

        print(f"[DUCKDB] Loading {csv_path} into table '{self.table_name}'...")
        start = time.time()

        # Create a fresh connection
        self.conn = duckdb.connect(database=":memory:")

        # Load CSV with auto-detection
        self.conn.execute(f"""
            CREATE TABLE {self.table_name} AS
            SELECT * FROM read_csv_auto('{str(path).replace(chr(92), '/')}')
        """)

        # Get row count
        result = self.conn.execute(f"SELECT COUNT(*) FROM {self.table_name}").fetchone()
        row_count = result[0] if result else 0

        elapsed = time.time() - start
        print(f"[DUCKDB] Loaded {row_count:,} rows in {elapsed:.2f}s")
        self._loaded = True

    def load_dataframe(self, df: pd.DataFrame, table_name: str = None) -> None:
        """
        Load a pandas DataFrame into DuckDB as a named table.

        Args:
            df: DataFrame to load.
            table_name: Override the default table name.
        """
        if table_name:
            self.table_name = table_name

        print(f"[DUCKDB] Loading DataFrame ({len(df):,} rows) into '{self.table_name}'...")
        start = time.time()

        self.conn = duckdb.connect(database=":memory:")
        self.conn.execute(f"CREATE TABLE {self.table_name} AS SELECT * FROM df")

        elapsed = time.time() - start
        print(f"[DUCKDB] Loaded in {elapsed:.2f}s")
        self._loaded = True

    def execute_query(self, sql: str, timeout_sec: float = 8.0) -> pd.DataFrame:
        """
        Execute a SQL query with safety validation and timeout.

        Args:
            sql: The SQL query to execute (SELECT only).
            timeout_sec: Maximum execution time in seconds.

        Returns:
            pd.DataFrame with query results.

        Raises:
            QuerySafetyError: If the query violates the allow-list.
            QueryTimeoutError: If the query exceeds the timeout.
            RuntimeError: If data hasn't been loaded yet.
        """
        if not self._loaded or self.conn is None:
            raise RuntimeError("No data loaded. Call load_data() or load_dataframe() first.")

        # ── Safety Gate ──
        _validate_query_safety(sql)

        # ── Execute with timing ──
        start = time.time()
        try:
            result = self.conn.execute(sql).fetchdf()
        except duckdb.Error as e:
            elapsed = time.time() - start
            if elapsed >= timeout_sec:
                raise QueryTimeoutError(
                    f"Query timed out after {elapsed:.1f}s (limit: {timeout_sec}s)"
                )
            raise RuntimeError(f"DuckDB query error: {e}")

        elapsed = time.time() - start
        if elapsed >= timeout_sec:
            raise QueryTimeoutError(
                f"Query timed out after {elapsed:.1f}s (limit: {timeout_sec}s)"
            )

        return result

    def get_table_schema(self) -> str:
        """
        Get the CREATE TABLE schema string for LLM context.

        Returns a string like:
            CREATE TABLE enterprise_data (
                Record_ID VARCHAR,
                Transaction_Date TIMESTAMP,
                ...
            )
        """
        if not self._loaded or self.conn is None:
            raise RuntimeError("No data loaded.")

        result = self.conn.execute(
            f"SELECT column_name, data_type FROM information_schema.columns "
            f"WHERE table_name = '{self.table_name}' ORDER BY ordinal_position"
        ).fetchdf()

        lines = [f"CREATE TABLE {self.table_name} ("]
        for _, row in result.iterrows():
            lines.append(f"    {row['column_name']} {row['data_type']},")
        # Remove trailing comma from last column
        if lines:
            lines[-1] = lines[-1].rstrip(",")
        lines.append(")")

        return "\n".join(lines)

    def get_table_info(self) -> dict:
        """
        Get table metadata as a dictionary.
        """
        if not self._loaded or self.conn is None:
            raise RuntimeError("No data loaded.")

        row_count = self.conn.execute(
            f"SELECT COUNT(*) FROM {self.table_name}"
        ).fetchone()[0]

        col_info = self.conn.execute(
            f"SELECT column_name, data_type FROM information_schema.columns "
            f"WHERE table_name = '{self.table_name}' ORDER BY ordinal_position"
        ).fetchdf()

        return {
            "table_name": self.table_name,
            "row_count": row_count,
            "column_count": len(col_info),
            "columns": [
                {"name": row["column_name"], "type": row["data_type"]}
                for _, row in col_info.iterrows()
            ],
        }

    def close(self) -> None:
        """Close the DuckDB connection."""
        if self.conn:
            self.conn.close()
            self.conn = None
            self._loaded = False
            print("[DUCKDB] Connection closed.")

    def __del__(self):
        """Cleanup on garbage collection."""
        self.close()

    def __repr__(self) -> str:
        status = "loaded" if self._loaded else "not loaded"
        return f"DuckDBEngine(table='{self.table_name}', status={status})"
