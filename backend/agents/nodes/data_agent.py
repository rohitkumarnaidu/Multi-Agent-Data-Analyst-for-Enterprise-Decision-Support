from typing import Dict, Any
import pandas as pd
import numpy as np
from agents.base import BaseEnterpriseAgent
from agents.state import EnterpriseAgentState
from agents.data_agent import data_agent

class DataAgent(BaseEnterpriseAgent):
    def __init__(self):
        super().__init__("data_agent")

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        question = state.get("question", "")
        
        # Generate SQL
        sql = data_agent.generate_sql(question)
        
        # Execute SQL
        df, final_sql, err = data_agent.execute_and_correct(sql, question)
        
        # Convert DataFrame to records, replacing NaN with None for JSON safety
        if not df.empty:
            df = df.replace({np.nan: None, pd.NA: None})
            data_results = df.to_dict(orient="records")
        else:
            data_results = []

        return {
            "sql_query": final_sql,
            "data_results": data_results,
            "errors": [err] if err else [],
            "metadata": {"data_agent_status": "success" if not err else "error"}
        }
