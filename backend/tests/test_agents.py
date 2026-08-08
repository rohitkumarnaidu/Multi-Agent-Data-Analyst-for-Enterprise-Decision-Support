import pytest
from agents.graph import enterprise_graph

def test_data_path():
    # Test standard data intent routing to Data -> Analysis -> Narrative -> Validator
    initial_state = {
        "session_id": "test_session_1",
        "question": "What is the training data?",
        "intent": "data"
    }
    
    result = enterprise_graph.invoke(initial_state)
    
    assert "data_agent executed" in result["trace"][0]
    assert "analysis_agent executed" in result["trace"][1]
    assert "narrative_agent executed" in result["trace"][2]
    assert "validator_agent executed" in result["trace"][3]
    assert result["validation_status"] == "passed"
    assert result["confidence"] > 0.9

def test_simulation_path():
    # Test simulation intent routing to Simulation -> Validator
    initial_state = {
        "session_id": "test_session_2",
        "question": "What if we increased pricing by 10%?",
        "intent": "simulate pricing"
    }
    
    result = enterprise_graph.invoke(initial_state)
    
    assert "simulation_agent executed" in result["trace"][0]
    assert "validator_agent executed" in result["trace"][1]
    assert result["validation_status"] == "passed"

def test_report_path():
    # Test report intent routing to Report -> Validator
    initial_state = {
        "session_id": "test_session_3",
        "question": "Generate an executive report",
        "intent": "report"
    }
    
    result = enterprise_graph.invoke(initial_state)
    
    assert "report_agent executed" in result["trace"][0]
    assert "validator_agent executed" in result["trace"][1]
    assert result["validation_status"] == "passed"
