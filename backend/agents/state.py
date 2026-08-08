from typing import TypedDict, Annotated, List, Dict, Any, Optional
import operator

def append_to_list(existing: List, new_item: Any) -> List:
    if not existing:
        existing = []
    if new_item is None:
        return existing
    if isinstance(new_item, list):
        return existing + new_item
    return existing + [new_item]

def merge_dicts(existing: Dict, new_dict: Dict) -> Dict:
    if not existing:
        return new_dict if new_dict is not None else {}
    if new_dict:
        merged = existing.copy()
        merged.update(new_dict)
        return merged
    return existing

class EnterpriseAgentState(TypedDict):
    session_id: str
    question: str
    intent: str
    
    # Execution Trace
    trace: Annotated[List[str], append_to_list]
    errors: Annotated[List[str], append_to_list]
    timing: Annotated[Dict[str, float], merge_dicts]
    metadata: Annotated[Dict[str, Any], merge_dicts]
    telemetry: Annotated[List[Dict[str, Any]], append_to_list]
    
    # RAG / Semantic Context (Placeholder for Phase 6B)
    retrieved_context: List[str]
    
    # Data Layer
    sql_query: Optional[str]
    data_results: Optional[List[Dict[str, Any]]]
    
    # Analysis & Narrative
    analysis: Optional[Dict[str, Any]]
    narrative: Optional[str]
    
    # Output & Validation
    validation_status: str  # "pending", "passed", "failed"
    confidence: float
    charts: Optional[List[Dict[str, Any]]]
    tables: Optional[List[Dict[str, Any]]]
