from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

# Create a presentation object
prs = Presentation()

# Define colors
navy = RGBColor(15, 37, 55)
teal = RGBColor(0, 168, 150)
slate = RGBColor(74, 85, 104)

def set_font(font, size=None, color=None, bold=False):
    font.name = 'Arial'
    if size:
        font.size = Pt(size)
    if color:
        font.color.rgb = color
    if bold:
        font.bold = bold

def add_slide(title, content, layout_idx=1):
    slide_layout = prs.slide_layouts[layout_idx]
    slide = prs.slides.add_slide(slide_layout)
    
    title_placeholder = slide.shapes.title
    title_placeholder.text = title
    set_font(title_placeholder.text_frame.paragraphs[0].font, size=36, color=navy, bold=True)
    
    if layout_idx == 1: # Title and Content
        body_shape = slide.placeholders[1]
        tf = body_shape.text_frame
        tf.word_wrap = True
        tf.text = content
        
        for p in tf.paragraphs:
            set_font(p.font, size=20, color=slate)

    return slide

# Slide 1: Title
slide_layout = prs.slide_layouts[0]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
subtitle = slide.placeholders[1]
title.text = "Multi-Agent Data Analyst\nfor Enterprise Decision Support"
subtitle.text = "Intelligent, explainable, and proactive analytics for the modern enterprise.\nBy: Your Name/Team"
set_font(title.text_frame.paragraphs[0].font, size=44, color=navy, bold=True)

# Slide 2: Exec Summary
add_slide("Executive Summary", 
          "• The Challenge: Traditional reporting is too slow and requires deep technical skills.\n"
          "• Our Solution: An 8-node intelligent agentic architecture (LangGraph) that understands natural language, retrieves data, and explains its findings.\n"
          "• The Value: Empowers non-technical users, accelerates decision-making, and guarantees explainable, hallucination-free metrics.")

# Slide 3: Problem Statement
add_slide("Problem Description", 
          "• Organizations generate large volumes of data across sales, finance, operations, and customer services, but business users often lack the technical skills to analyze this data quickly.\n"
          "• Traditional reporting depends on data analysts, making the process slow and delaying important business decisions.\n"
          "• This challenge focuses on using Generative AI and Agentic AI to build a multi-agent system that can understand business questions, retrieve and analyze enterprise data, generate visualizations, and provide clear insights automatically.\n"
          "• Participants can develop an intelligent assistant that enables non-technical users to access accurate, explainable, and actionable insights, helping organizations make faster and more informed decisions.")

# Slide 4: Objectives
add_slide("Objectives", 
          "• Design a multi-agent architecture where specialized agents handle distinct analytical tasks\n"
          "• Enable the system to interpret natural language business questions accurately\n"
          "• Develop agents capable of retrieving, processing, and analyzing enterprise data\n"
          "• Generate clear visualizations and narrative summaries of analytical findings\n"
          "• Ensure explainability and accuracy of AI-generated insights and recommendations\n"
          "• Build an interface that allows non-technical users to interact with the system easily\n"
          "• Improve organizational agility through faster, more accessible data-driven decisions")

# Slide 5: The Solution
add_slide("Introducing Our Solution", 
          "• What it is: A multi-agent ecosystem powered by LangGraph, integrated with XGBoost/LightGBM for risk analysis.\n"
          "• Key Differentiators:\n"
          "  - Deterministic Math: LLMs never invent numbers.\n"
          "  - Agentic Hybrid RAG: Intelligent retrieval only when needed.\n"
          "  - Proactive Alerting: Uncovers risks before you ask.\n"
          "  - What-If Simulation: Honest, bounded forecasting.")

# Slide 6: High-Level Architecture
add_slide("Multi-Agent Architecture", 
          "• 8-Node Graph: Designed for complex, stateful reasoning.\n"
          "  - Orchestrator → (Knowledge / Anomaly / Simulation / Data) → Analysis → Narrative → Validator → Human Approval\n"
          "• Human-in-the-loop: Native interruption for high-risk recommendations.")

# Slide 7: Specialized Agent Roles
add_slide("Specialized Agents at Work", 
          "• Orchestrator: Classifies intent and routes the query.\n"
          "• Knowledge Agent: Agentic RAG for semantic text and business glossaries.\n"
          "• Data Agent: Drafts and executes safe, read-only SQL queries.\n"
          "• Analysis Agent: Computes metrics (pandas/DuckDB) — no LLM hallucinations.\n"
          "• Anomaly/Risk Agent: Uses XGBoost to surface proactive insights.\n"
          "• Validator Agent: Cross-checks narratives against hard data and flags for human approval.")

# Slide 8: Data Pipeline
add_slide("Data Pipeline & Reasoning Flow", 
          "• Source: Messy enterprise datasets (e.g., TPC-DS, multi-domain schemas).\n"
          "• Preprocessing: Automated cleaning and schema linking.\n"
          "• Reasoning: Agent coordination and machine learning inference.\n"
          "• Action: Dashboards and PDF Executive Summaries.")

# Slide 9: Use-Case Scenarios
add_slide("Actionable Insights in Action", 
          "• Sales: \"Region West revenue down 12%. Recommendation: Reallocate marketing spend. Confidence: Medium.\"\n"
          "• Finance: \"Cost category X growing 20% faster than revenue. Recommendation: Renegotiate vendor contract.\"\n"
          "• Customer Service: \"Complaint spike detected by Anomaly Agent proactively. Recommendation: Flag product for quality review.\"")

# Slide 10: Interface Design
add_slide("Designed for the Business User", 
          "• Live Application (Streamlit): Chat interface with a transparent 'Agent Trace' panel to show the system's work.\n"
          "• Proactive Dashboard (Power BI): High-level KPIs and slicers for execs.\n"
          "• Export to PDF: One-click executive one-pager generation.")

# Slide 11: Explainability
add_slide("Ensuring Trust and Accuracy", 
          "• Deterministic Math: LLMs generate language, Python/SQL generate numbers.\n"
          "• Validator Node: A dedicated agent verifies the narrative against the raw data before the user sees it.\n"
          "• Confidence Scoring: Every insight comes with a transparency badge.\n"
          "• Human-Approval Gate: High-risk actions automatically pause the system to require human sign-off.")

# Slide 12: Deliverables
add_slide("Expected Deliverables", 
          "• Source Code\n"
          "• Machine Learning / AI Model\n"
          "• Data Preprocessing Pipeline\n"
          "• Dashboard / Visualization\n"
          "• Technical Documentation\n"
          "• Presentation (PPT)\n"
          "• Prediction Results")

# Slide 13: Evaluation & Success Metrics
add_slide("Evaluation & Success Metrics", 
          "• Model Metrics (XGBoost): Accuracy, Precision, Recall, F1, ROC-AUC.\n"
          "• Pipeline Metrics (Golden Test Set):\n"
          "  - Routing accuracy (≥ 90%)\n"
          "  - Groundedness (zero unsupported numbers)\n"
          "  - Latency (< 15s end-to-end)\n"
          "  - Query success rate & safety (100% read-only).")

# Slide 14: MVP Roadmap
add_slide("MVP Roadmap & Implementation Plan", 
          "• Phase 1: Data Foundation. Load TPC-DS, schema views, metric definitions.\n"
          "• Phase 2: Core Pipeline. Orchestrator and Data Agents live.\n"
          "• Phase 3: Intelligence. Integrate XGBoost, Anomaly, and Simulation agents.\n"
          "• Phase 4: UX & Polish. Streamlit UI, Power BI, PDF Export, and final evaluations.")

# Slide 15: Execution Timeline
add_slide("Execution Timeline", 
          "• Hours 1-3: Dataset lock-in & cleaning.\n"
          "• Hours 3-9: Core graph wiring & XGBoost training.\n"
          "• Hours 9-15: Golden test runs & Simulation/Memory agents.\n"
          "• Hours 15-24: UI polish, docs, and rehearsal.")

# Slide 16: Risks & Mitigations
add_slide("Risk Management", 
          "• Risk: LLM hallucinating numbers. | Mitigation: Deterministic Analysis agent + Validator agent.\n"
          "• Risk: High-risk automated actions. | Mitigation: LangGraph native human-approval interrupt.\n"
          "• Risk: API limits / latency. | Mitigation: Hybrid local (Ollama) and cloud model routing.")

# Slide 17: Conclusion
add_slide("Conclusion & Q&A", 
          "• Empowering non-technical users with fast, explainable, and accurate insights.\n"
          "• Thank You!\n"
          "• Questions?")

# Slide 18: Appendix 1
add_slide("Appendix: Data Strategy & Schema", 
          "• Overview of the TPC-DS / Multi-domain schema strategy, highlighting sales, finance, ops, and customer domains.\n"
          "• Pre-computed semantic layer.")

# Slide 19: Appendix 2
add_slide("Appendix: XGBoost Model Details", 
          "• Details on the supervised anomaly/risk model.\n"
          "• Feature engineering (ratios, aggregations).\n"
          "• How it feeds the Anomaly Agent.")

# Slide 20: Appendix 3
add_slide("Appendix: Architecture Guardrails", 
          "• Read-only DB roles.\n"
          "• Query timeouts.\n"
          "• Row limits.\n"
          "• Semantic caching.")

prs.save("Multi-Agent_Data_Analyst_Final.pptx")
print("Saved to Multi-Agent_Data_Analyst_Final.pptx")
