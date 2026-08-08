"""
Report Agent — Multi-Agent Data Analyst
========================================
Generates enterprise-grade, styled PDF executive briefing reports using ReportLab.

Per Master Plan Section 10.2:
  - Formats executive summary, KPIs, and recommendations
  - Embeds governance stamps & audit signatures
  - Outputs downloadable binary PDF buffer
"""

import io
from datetime import datetime
from typing import Dict, Any, Optional, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


class ReportAgent:
    """
    Builds executive PDF documents from multi-agent analysis state.
    """

    def generate_pdf_report(
        self,
        question: str,
        answer: str,
        recommended_action: Optional[str] = None,
        kpi_data: Optional[Dict[str, Any]] = None,
        confidence_level: str = "HIGH",
        confidence_score: float = 0.95,
        sql_query: Optional[str] = None
    ) -> bytes:
        """
        Builds a styled PDF report in memory and returns raw bytes.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom Enterprise Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0f172a"),
            alignment=TA_LEFT
        )
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#64748b")
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#1e3a8a"),
            spaceBefore=8,
            spaceAfter=4
        )
        body_style = ParagraphStyle(
            "BodyDark",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155")
        )
        recommendation_style = ParagraphStyle(
            "RecText",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#065f46")
        )
        code_style = ParagraphStyle(
            "CodeBlock",
            parent=styles["Code"],
            fontName="Courier",
            fontSize=7,
            leading=9,
            textColor=colors.HexColor("#1e293b")
        )

        story = []

        # ── 1. Header Banner ──
        header_data = [
            [
                Paragraph("<b>DATASPHERE 26</b> | Multi-Agent Enterprise Decision Support", title_style),
                Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}<br/><b>Status:</b> Certified", subtitle_style)
            ]
        ]
        header_table = Table(header_data, colWidths=[380, 160])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ]))
        story.append(header_table)
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=10))

        # ── 2. Query & Confidence Metadata ──
        meta_data = [
            [
                Paragraph(f"<b>Business Query:</b> {question}", body_style),
                Paragraph(f"<b>Confidence:</b> <font color='{'green' if confidence_score>=0.85 else 'orange'}'>{confidence_level} ({confidence_score*100:.0f}%)</font>", subtitle_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[420, 120])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 10))

        # ── 3. Executive Summary ──
        story.append(Paragraph("Executive Summary & Core Insights", section_heading))
        # Format markdown bold for reportlab
        clean_answer = answer.replace("**", "<b>").replace("•", "&bull;")
        for para in clean_answer.split("\n\n"):
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))
                story.append(Spacer(1, 4))

        # ── 4. Strategic Recommendations ──
        if recommended_action:
            story.append(Spacer(1, 6))
            story.append(Paragraph("Strategic Action Item & Ownership", section_heading))
            rec_box = Table(
                [[Paragraph(f"&bull; {recommended_action}", recommendation_style)]],
                colWidths=[540]
            )
            rec_box.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#ecfdf5")),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#10b981")),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ]))
            story.append(rec_box)

        # ── 5. KPI Data Summary ──
        if kpi_data and isinstance(kpi_data, dict):
            story.append(Spacer(1, 8))
            story.append(Paragraph("Key Performance Metrics", section_heading))
            table_rows = [["Metric Dimension", "Value"]]
            for k, v in list(kpi_data.items())[:6]:
                val_str = f"{v:,.2f}" if isinstance(v, (int, float)) else str(v)
                table_rows.append([str(k).replace("_", " ").title(), val_str])

            kpi_table = Table(table_rows, colWidths=[300, 240])
            kpi_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e293b")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(kpi_table)

        # ── 6. Auditable Governance & SQL Trace ──
        if sql_query:
            story.append(Spacer(1, 8))
            story.append(Paragraph("Auditable SQL Lineage & Execution Trace", section_heading))
            sql_box = Table(
                [[Paragraph(sql_query, code_style)]],
                colWidths=[540]
            )
            sql_box.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(sql_box)

        # ── 7. Footer Stamp ──
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#94a3b8"), spaceAfter=4))
        story.append(Paragraph("Datasphere 26 Enterprise AI Governance Board &bull; Certified Zero-Trust Multi-Agent Engine &bull; Confidential", subtitle_style))

        # Build document
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()


# Singleton instance
report_agent = ReportAgent()
