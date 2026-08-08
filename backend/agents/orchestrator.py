"""
Orchestrator Agent — Multi-Agent Data Analyst
==============================================
Classifies user intent, resolves conversational follow-ups,
extracts key entities, and decides graph routing.

Per Master Plan Section 5.3:
  - 1 LLM classification call with timeout
  - Deterministic keyword-rule fallback for 100% reliability
  - Memory-aware for conversational context
"""

import re
import json
import time
from typing import Dict, Any, Optional, List
from backend.config import settings, get_llm

INTENT_CATEGORIES = [
    "sql_query",       # Quantitative analytics, aggregations, trends, top-N, filters
    "rag_knowledge",   # Conceptual definitions, metric formulas, policies, rules
    "anomaly_risk",    # Risk scoring, anomaly inspection, SLA breach predictions
    "simulation",      # What-if scenario analysis, hypothetical parameter adjustments
    "general_faq",     # System capabilities, greetings, general assistance
    "out_of_scope",    # Non-enterprise questions (weather, general trivia, code exploits)
]

# ── Deterministic Rule Matcher (Fallback & Speed) ──
SIMULATION_KEYWORDS = ["what if", "what-if", "simulate", "suppose", "assume", "decrease by", "increase by", "if we reduce", "if we increase"]
# Only full audit/scan requests route to anomaly_risk; specific metric queries (e.g. 'highest anomaly score') are sql_query
ANOMALY_KEYWORDS = ["run a full", "run an anomaly", "full audit", "risk audit", "operational audit", "risk scan", "anomaly scan", "run anomaly check", "run risk", "breach prediction", "predict breach", "predict sla"]
# 'what is' alone is too broad — 'What is the SLA breach rate by dept?' is a SQL query.
# Only explicit definitional/formula phrases route to rag_knowledge.
KNOWLEDGE_KEYWORDS = ["formula for", "define ", "definition of", "what does", "meaning of", "policy on", "policy for", "explain the concept", "how is calculated", "what formula", "pii policy"]
OUT_OF_SCOPE_KEYWORDS = ["weather", "president", "recipe", "poem", "sports", "capital of", "movie", "song", "joke", "hack", "system prompt"]


def rule_based_classify(question: str) -> Dict[str, Any]:
    """
    Deterministic regex/keyword classifier.
    Guarantees < 1ms classification with 0 external dependencies.
    """
    q = question.lower().strip()

    # Out of scope check
    for kw in OUT_OF_SCOPE_KEYWORDS:
        if kw in q:
            return {
                "intent": "out_of_scope",
                "confidence": 0.95,
                "reason": f"Matched out-of-scope pattern: '{kw}'",
                "entities": {}
            }

    # Simulation check
    for kw in SIMULATION_KEYWORDS:
        if kw in q:
            return {
                "intent": "simulation",
                "confidence": 0.90,
                "reason": f"Matched simulation indicator: '{kw}'",
                "entities": _extract_entities(q)
            }

    # Anomaly / Risk check
    for kw in ANOMALY_KEYWORDS:
        if kw in q:
            return {
                "intent": "anomaly_risk",
                "confidence": 0.88,
                "reason": f"Matched anomaly/risk keyword: '{kw}'",
                "entities": _extract_entities(q)
            }

    # Knowledge check
    for kw in KNOWLEDGE_KEYWORDS:
        if kw in q and not any(agg in q for agg in ["average", "sum", "total", "count", "highest", "lowest", "by department"]):
            return {
                "intent": "rag_knowledge",
                "confidence": 0.85,
                "reason": f"Matched knowledge keyword: '{kw}'",
                "entities": _extract_entities(q)
            }

    # Default to SQL Analytics query
    return {
        "intent": "sql_query",
        "confidence": 0.92,
        "reason": "Quantitative analytics / aggregation query detected",
        "entities": _extract_entities(q)
    }


def _extract_entities(text: str) -> Dict[str, Any]:
    """Extract standard dimensions and metrics from text."""
    entities = {}

    # Departments
    departments = ["finance", "it operations", "itops", "marketing", "supply chain", "sales", "hr", "customer service"]
    for dept in departments:
        if dept in text:
            entities["department"] = "IT Operations" if dept == "itops" else dept.title()
            break

    # Business Units / Regions
    regions = ["north america", "emea", "apac", "latam", "europe", "asia pacific", "latin america"]
    for reg in regions:
        if reg in text:
            entities["region"] = reg.upper() if len(reg) <= 5 else reg.title()
            break

    # Agents
    agents = ["finance_agent", "itops_agent", "marketing_agent", "supplychain_agent", "sales_agent", "hr_agent", "customerservice_agent"]
    for ag in agents:
        if ag in text or ag.replace("_", " ") in text:
            entities["agent"] = ag

    # Priority / Risk
    for lvl in ["urgent", "high", "medium", "low"]:
        if f"{lvl} priority" in text or f"priority {lvl}" in text:
            entities["priority"] = lvl.title()
        if f"{lvl} risk" in text or f"risk {lvl}" in text:
            entities["risk"] = lvl.title()

    # Time period
    for qtr in ["q1", "q2", "q3", "q4"]:
        if qtr in text:
            entities["quarter"] = qtr.upper()

    return entities


class OrchestratorAgent:
    """
    Orchestrates user request classification, contextual resolution,
    and routing across the multi-agent graph.
    """

    def __init__(self):
        self.llm = None
        self._init_llm()

    def _init_llm(self):
        try:
            self.llm = get_llm(temperature=0.0)
        except Exception as e:
            print(f"[Orchestrator] LLM initialization deferred/failed ({e}), using rule-based classifier.")

    def classify(self, question: str, session_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Classifies query intent. Tries LLM classification first; falls back to rule matching.
        """
        start_time = time.time()

        # Check for context in follow-ups (e.g., 'What about Q3?')
        resolved_question = question
        if session_history and len(session_history) > 0:
            last_turn = session_history[-1]
            if len(question.split()) <= 5 and any(word in question.lower() for word in ["what about", "how about", "and for", "show me"]):
                resolved_question = f"{last_turn.get('question', '')} - follow-up filter: {question}"

        # Attempt LLM classification
        if self.llm:
            try:
                prompt = (
                    f"You are an enterprise AI Orchestrator. Classify the user question into exactly one intent.\n"
                    f"Allowed intents: {INTENT_CATEGORIES}\n"
                    f"Question: \"{resolved_question}\"\n\n"
                    f"Respond ONLY with a valid JSON object in this format:\n"
                    f'{{"intent": "sql_query|rag_knowledge|anomaly_risk|simulation|general_faq|out_of_scope", "confidence": 0.95, "reason": "brief reason"}}\n'
                )
                response = self.llm.invoke(prompt)
                content = response.content if hasattr(response, "content") else str(response)
                match = re.search(r"\{.*\}", content, re.DOTALL)
                if match:
                    parsed = json.loads(match.group())
                    if parsed.get("intent") in INTENT_CATEGORIES:
                        parsed["entities"] = _extract_entities(resolved_question.lower())
                        parsed["resolved_question"] = resolved_question
                        parsed["duration_sec"] = round(time.time() - start_time, 4)
                        return parsed
            except Exception as e:
                print(f"[Orchestrator] LLM classification timed out or failed ({e}), invoking rule fallback.")

        # Fallback: Deterministic Rule Classifier
        res = rule_based_classify(resolved_question)
        res["resolved_question"] = resolved_question
        res["duration_sec"] = round(time.time() - start_time, 4)
        return res


# Singleton instance
orchestrator = OrchestratorAgent()
