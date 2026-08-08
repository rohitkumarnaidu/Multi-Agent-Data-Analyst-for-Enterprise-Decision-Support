"""
Narrative Agent — Multi-Agent Data Analyst
===========================================
Translates deterministic numbers from the Analysis Agent skeleton,
Anomaly Agent, or Simulation Agent into plain-English executive insights
and actionable recommendations with assigned owners.

Per Master Plan Section 5.3 & ADR Zero-Trust Principle:
  - Language synthesis ONLY (NO numbers invented)
  - Citations must strictly match InsightSkeleton
  - Generates recommended action + role owner
  - Cloud LLM -> Local LLM -> Deterministic template fallback
"""

import re
from typing import Dict, Any, Optional, Tuple, List
from backend.config import settings, get_llm
from backend.agents.analysis_agent import InsightSkeleton


class NarrativeAgent:
    """
    Synthesizes grounded executive summaries and actionable recommendations.
    """

    def __init__(self):
        self.llm = None
        self._init_llm()

    def _init_llm(self):
        try:
            self.llm = get_llm(temperature=0.2)
        except Exception as e:
            print(f"[NarrativeAgent] LLM initialization deferred/failed ({e}), using template engine.")

    def generate_narrative(
        self,
        question: str,
        skeleton: InsightSkeleton,
        retrieved_context: str = ""
    ) -> Tuple[str, Optional[str]]:
        """
        Generates grounded executive answer and actionable recommendation.
        Returns: (answer_text, recommended_action)
        """
        # Format skeleton facts into structured text
        facts_text = (
            f"Total Records: {skeleton.total_records:,}\n"
            f"Primary Metric: {skeleton.primary_metric}\n"
            f"Primary Value: {skeleton.primary_value:,.2f}\n"
        )
        if skeleton.top_entity:
            facts_text += f"Top Performer: {skeleton.top_entity} ({skeleton.top_entity_value:,.2f})\n"
        if skeleton.bottom_entity:
            facts_text += f"Bottom Performer: {skeleton.bottom_entity} ({skeleton.bottom_entity_value:,.2f})\n"
        if skeleton.time_trend:
            facts_text += f"Trend: {skeleton.time_trend}\n"
        if skeleton.breakdown:
            top_3 = sorted(skeleton.breakdown.items(), key=lambda x: x[1], reverse=True)[:5]
            breakdown_str = ", ".join([f"{k}: {v:,.2f}" for k, v in top_3])
            facts_text += f"Top Breakdown: {breakdown_str}\n"

        # Attempt LLM generation
        if self.llm:
            try:
                prompt = (
                    f"You are the Chief AI Communications Officer for an enterprise AI operations platform.\n"
                    f"Write a concise executive summary answering the user question based ONLY on the verified data below.\n"
                    f"STRICT RULES:\n"
                    f"1. DO NOT invent, calculate, or hallucinate any numbers. ONLY cite numbers given in VERIFIED DATA.\n"
                    f"2. Keep the answer professional, executive-ready, and structured (2-3 short paragraphs).\n"
                    f"3. Include a final section 'RECOMMENDED ACTION: [Action] (Owner: [Role])'.\n\n"
                    f"--- VERIFIED DATA ---\n"
                    f"{facts_text}\n"
                    f"{retrieved_context}\n"
                    f"--------------------\n\n"
                    f"User Question: {question}\n\n"
                    f"Executive Response:"
                )
                response = self.llm.invoke(prompt)
                content = response.content if hasattr(response, "content") else str(response)

                # Extract recommended action if present
                rec_match = re.search(r"RECOMMENDED ACTION:\s*(.+)", content, re.IGNORECASE)
                rec_action = rec_match.group(1).strip() if rec_match else self._derive_default_recommendation(skeleton)

                return content.strip(), rec_action
            except Exception as e:
                print(f"[NarrativeAgent] LLM generation failed ({e}), falling back to deterministic template.")

        # Fallback: Deterministic Template Narrative
        return self._generate_template_narrative(question, skeleton)

    def _generate_template_narrative(self, question: str, skeleton: InsightSkeleton) -> Tuple[str, str]:
        """Deterministic template generator ensuring 100% availability."""
        metric_name = skeleton.primary_metric.replace("_", " ").title()
        
        if skeleton.total_records == 0:
            return "No matching enterprise records were found for the specified query criteria.", "Review filter parameters and verify database partition bounds."

        lines = [
            f"Based on the analysis of **{skeleton.total_records:,} enterprise transactions**, {metric_name} is evaluated at **{skeleton.primary_value:,.2f}**."
        ]

        if skeleton.top_entity and skeleton.bottom_entity:
            lines.append(
                f"• **Top Performer:** **{skeleton.top_entity}** led with **{skeleton.top_entity_value:,.2f}**.\n"
                f"• **Lagging Segment:** **{skeleton.bottom_entity}** recorded **{skeleton.bottom_entity_value:,.2f}**."
            )
            spread = skeleton.top_entity_value - skeleton.bottom_entity_value
            lines.append(f"• **Performance Spread:** {spread:,.2f} delta observed across business units.")

        if skeleton.time_trend:
            lines.append(f"• **Temporal Dynamics:** The observed trajectory indicates a **{skeleton.time_trend}** pattern over the operational period.")

        rec_action = self._derive_default_recommendation(skeleton)
        lines.append(f"\n**Recommended Strategic Action:**\n{rec_action}")

        return "\n\n".join(lines), rec_action

    def _derive_default_recommendation(self, skeleton: InsightSkeleton) -> str:
        """Derives a deterministic role-assigned recommendation based on metrics."""
        m = skeleton.primary_metric.lower()
        if "efficiency" in m or "latency" in m or "time" in m:
            return f"Allocate caching and token optimization resources to lower-performing tiers (e.g. {skeleton.bottom_entity or 'lagging agents'}). (Owner: Principal MLOps Engineer)"
        elif "breach" in m or "sla" in m or "risk" in m:
            return f"Initiate operational SLA audit on {skeleton.top_entity or 'high-risk segments'} to enforce automated circuit-breakers. (Owner: Head of AI Governance)"
        elif "savings" in m or "revenue" in m or "cost" in m:
            return f"Expand autonomous resolution playbook from top performer ({skeleton.top_entity or 'leading unit'}) to accelerate organization-wide ROI. (Owner: VP of Enterprise Operations)"
        else:
            return "Conduct bi-weekly operational review of variance indicators across business units. (Owner: AI Governance Lead)"


# Singleton instance
narrative_agent = NarrativeAgent()
