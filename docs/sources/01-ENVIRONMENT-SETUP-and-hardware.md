# 01 — Environment Setup, Hardware & Resource Audit

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Read and run this tonight (06 Aug), not tomorrow. The reference project in `doc-07` had to mock its entire live agent execution because of exactly the dependency problems this file exists to prevent — C++ build tools missing for `hnswlib`/`chromadb`, Docker timeouts, Windows Python incompatibilities. That failure mode is avoidable, and avoiding it is worth more to the final score than any single feature.

---

## 1. Why Docker, specifically

The honest lesson from the reference project's reality-check: CrewAI's dependency chain (and ChromaDB's native `hnswlib` bindings) needs a working C++ build toolchain, and on a random Windows laptop that toolchain is very often *not* set up correctly — which is exactly what forced their team to fake the live LLM calls in the final demo. Docker sidesteps this entirely: the Python backend (LangGraph, DuckDB, ChromaDB, XGBoost, the agent code) runs inside a Linux container with a known-good, pre-tested dependency set, regardless of what's actually installed on the host Windows machine.

**What stays outside Docker: Ollama.** GPU passthrough for Ollama through Docker on Windows adds real complexity (WSL2 GPU forwarding configuration) for very little benefit. Run Ollama natively on the host — it's a single installer, it manages the GPU directly, and the Dockerized backend just calls it over the network at `http://host.docker.internal:11434` instead of `localhost`. Simpler, and it's the one component where native performance actually matters (LLM inference speed).

## 2. Docker setup

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
      - ./outputs:/app/outputs
    environment:
      - OLLAMA_HOST=http://host.docker.internal:11434
      - CLOUD_LLM_API_KEY=${CLOUD_LLM_API_KEY}
    extra_hosts:
      - "host.docker.internal:host-gateway"   # needed on Linux hosts; no-op on Windows/Mac

  streamlit:
    build: ./streamlit_app
    ports:
      - "8501:8501"
    depends_on:
      - backend
```

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim
# build-essential covers the C++ toolchain that hnswlib/chromadb need —
# baked into the image once, never an issue on anyone's laptop again
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Verify tonight:** `docker compose up --build`, confirm the backend container can reach Ollama on the host, confirm ChromaDB initializes inside the container without a build error. This single test is the highest-value 10 minutes of the whole prep night.

## 3. Ollama model choice — resolved for your actual hardware (RTX 3050, 6GB VRAM, 16GB system RAM)

**Primary: `llama3.1:8b` at Q4_K_M (~5.5GB).** This is the specific, current community consensus pick for exactly this GPU tier — the RTX 3050 6GB is named directly as the target hardware class for this recommendation, running at roughly 18 tokens/second on Windows (a bit slower than the ~25 tok/s a unified-memory Mac gets on the same model, due to PCIe transfer overhead, but well within our latency budget for narrative generation).

**Alternate: `qwen2.5:7b` Q4_K_M** — near-identical footprint, worth trying if Llama 3.1's outputs underperform on your actual dataset's domain language during rehearsal.

**Lean fallback: `qwen2.5:3b` or `phi-4-mini`** — only needed if VRAM contention becomes a real problem (see Section 4).

### The VRAM budget problem, and how we solve it

5.5GB of a 6GB card is almost the whole budget — there's very little headroom left if the embedding model (BGE-large) also wants GPU memory at the same time the LLM is generating a narrative. Two options, in order of preference:

1. **Run embeddings on CPU.** `sentence-transformers` runs BGE-large on CPU without much pain at our data volume — embedding generation isn't on the live-response critical path the way narrative generation is, so a slower CPU pass is an acceptable trade. **This is the default plan.**
2. **If CPU embedding proves too slow in rehearsal,** swap to `bge-small-en-v1.5` on GPU instead — small enough to coexist with the LLM in 6GB, meaningful quality trade-off, but keeps everything on GPU.

Decide which of the two you're actually running by **Hour 3** of the live event, based on how rehearsal tonight goes — don't leave it undecided into the build day.

```bash
# tonight, on the machine that will run the local fallback:
ollama pull llama3.1:8b
ollama pull qwen2.5:7b        # backup
ollama run llama3.1:8b "Summarize: revenue rose 12% in Q3."   # confirm it actually generates
```

## 4. Resource audit — the pasted "AI Resources" list, marked for this event

Going through the resource sheet you pasted (`doc-08`), category by category, against what a 3-person team can actually ship in 24 hours plus what's already decided in the master plan:

| Category | Item | Verdict | Why |
|---|---|---|---|
| Agent framework | LangGraph | ✅ Use | Already the confirmed choice — Master Plan §5 |
| Agent framework | CrewAI, AutoGen, SmolAgents | ❌ Skip | One framework, chosen deliberately; switching mid-build is the exact risk that sank the reference project |
| LLM | Llama 3.3 / Qwen 3 / Phi-4 | ✅ Use (local tier) | See Section 3 — Llama 3.1 8B / Qwen2.5 7B is the right size class for the actual hardware; newer 3.x/Phi-4 variants are fine drop-in swaps if pulled successfully tonight |
| LLM | GPT-5 | ⚠️ Conditional | Fine as the **cloud primary** if a working key with headroom exists — not a hard requirement, whichever cloud key is fastest to confirm working wins |
| Embeddings | BAAI BGE Large / small | ✅ Use | Already decided — Master Plan §6, run on CPU per Section 3 above |
| Embeddings | E5 Large, MiniLM | ❌ Skip | BGE already selected; adding a second embedding model doubles a decision with no clear win |
| Vector DB | ChromaDB | ✅ Use | Embedded, no server — Master Plan §13 |
| Vector DB | Qdrant, Pinecone | ❌ Skip | Qdrant's "production" tier and Pinecone's cloud dependency both buy nothing for a single-laptop demo and cost real setup time — already decided against in the master plan |
| Vector DB | FAISS | ❌ Skip | Redundant with ChromaDB's own vector index; no reason to run two |
| Document processing | Unstructured, PyMuPDF, Docling, pdfplumber | ⚠️ Conditional | Only relevant if the real dataset includes PDF/Word documents rather than plain CSV/text fields — hold until Hour 1–3 schema check confirms this is needed at all |
| OCR | PaddleOCR, EasyOCR | ❌ Skip | Nothing in the problem statement implies scanned images; adding OCR capability nobody asks for is scope with zero rubric payoff |
| Data analysis | Pandas, DuckDB | ✅ Use | Already the core — Master Plan §13 |
| Data analysis | Polars | ❌ Skip | Pandas + DuckDB already covers the performance need at this data scale; a second dataframe library is a second thing to debug |
| Data analysis | OpenPyXL | ⚠️ Conditional | Only if the real dataset arrives as `.xlsx` rather than CSV/Parquet — cheap to add if needed, skip otherwise |
| SQL tools | SQLAlchemy | ❌ Skip | DuckDB is queried directly; an ORM layer adds abstraction with no benefit here |
| SQL tools | SQLite | ❌ Skip | DuckDB already does everything SQLite would, faster, for analytics workloads |
| Search | BM25, Hybrid Search | ✅ Use | Already decided — Master Plan §6 |
| Reranking | BGE Reranker | ⚠️ Conditional | Genuine quality lever for the Knowledge node's retrieval — add only after the core RAG path (Hour 6–9 gate) is working; a Should-Have refinement, not a Must-Have |
| Charts | Plotly | ✅ Use | Already decided — Master Plan §13 |
| Charts | Recharts, Apache ECharts | ❌ Skip | Both are for a custom frontend build; we're on Streamlit, not React — see next row |
| Frontend | React, Next.js, Tailwind, shadcn/ui | ❌ Skip | Streamlit was the confirmed decision specifically to protect build time for the agent side — a full React frontend is a different, much larger project |
| Backend | FastAPI | ✅ Use | Correct choice to expose the LangGraph pipeline behind a `/ask` endpoint that Streamlit calls — cheap to add, cleanly separates the agent backend from the UI |
| Database | PostgreSQL, MongoDB | ❌ Skip | DuckDB (analytics) + ChromaDB (vectors) + local files already cover every real need; adding a server database is infrastructure with no rubric payoff for a single-laptop demo |
| Auth | Firebase Auth, Supabase Auth | ❌ Skip | Explicitly a Won't-Have in the feature plan — not evaluated, not worth an hour |
| Caching | Redis | ❌ Skip | No concurrent-user load to justify it; LangGraph's own checkpointing already handles session state |
| AI evaluation | RAGAS | ✅ Use | Already planned — Master Plan §12, detailed per-module in `03-METRICS-EVALUATION-BENCHMARKS.md` |
| Monitoring | LangSmith, Phoenix | ⚠️ Conditional | Genuinely useful for debugging the graph during the build — turn on LangSmith tracing (free tier) if there's a spare 10 minutes at Hour 6; not worth chasing if things are running behind |
| Deployment | Docker | ✅ Use | Section 1–2 above |
| Deployment | Vercel, Railway | ❌ Skip | Nothing here needs to be cloud-deployed for a laptop-based live demo — deploying adds a failure surface (DNS, cold starts, venue Wi-Fi) with no judging benefit |
| Report generation | ReportLab | ✅ Use (fallback) | WeasyPrint is primary per Master Plan §8.3; ReportLab is the documented fallback if WeasyPrint's system dependencies misbehave |
| Report generation | python-docx | ❌ Skip | PDF was the committed format; adding a second export format is scope with no requested payoff |
| Optional advanced features | Human Approval Workflow, AI Memory, Knowledge Graph (GraphRAG) | ✅ / ⚠️ Already decided | Human approval and memory are committed features (Master Plan §5, §8.4); GraphRAG/Neo4j is the explicit conditional Could-Have (§6.3) |
| Optional advanced features | Voice Assistant, Live Collaboration, Real-time Notifications, Multi-language, Email sharing | ❌ Skip | None map to a rubric category or a committed feature — pure scope risk |
| Optional advanced features | Forecasting, Root Cause Analysis, Explainable AI | ✅ Already covered | Forecasting ≈ the what-if Simulation node; root-cause ≈ the Anomaly/Risk node's driver breakdown; explainability ≈ the whole Validator/trace design |

**Reading this table straight through is itself worth doing as a team tonight** — it's a fast way for all three people to agree on the same boundary at the same time, instead of discovering a scope disagreement live during the build.

## 5. Hackathon-rules compliance check

Cross-referencing the event FAQ against everything above:

- **Pre-trained models:** explicitly allowed — "pre-trained base models from open repositories (like Hugging Face or PyTorch Hub) are fully allowed." Our BGE embeddings, Ollama LLMs, and any Hugging Face-hosted classifier weights are all covered.
- **Fine-tuning and RAG:** explicitly "highly encouraged" by the organizers — our Knowledge/RAG layer and any light fine-tuning of the XGBoost model (which isn't fine-tuning in the LLM sense, but is the closest analogue) are squarely in the spirit of what's being asked for, not just tolerated.
- **ChatGPT / AI coding assistants:** allowed for guidance, code help, and understanding — consistent with how this whole planning set has been used. The final idea, logic, and decisions remain the team's own, which is exactly the framing carried through every file in this set.
- **External datasets:** the original event rules explicitly prohibit *private* external datasets. However, you have been provided with the official competition dataset (`enterprise_multiagent_decision_support.csv`). Rely exclusively on this.
- **Hugging Face specifically:** anything pulled from Hugging Face Hub (embedding models, any smaller open LLM, tokenizers) is explicitly covered by the "pre-trained models... fully allowed" answer — no separate justification needed.

## 6. What to bring (logistics, not just software)

- Laptop chargers — all three, plus a shared power strip/extension if the venue's outlet spacing is unfriendly
- Any physical ID or registration confirmation the event may require for check-in (confirm the exact requirement from the organizers directly — this wasn't independently verifiable from the public site and shouldn't be assumed)
- A charged mobile hotspot as a Wi-Fi backup, given how much of the risk register already centers on venue connectivity
- Headphones (for any team member reviewing recorded rehearsal footage or working heads-down near others)
- A physical notebook/pen — genuinely useful for the decision log and risk log when a laptop is mid-build and switching windows would break flow

## 7. Tonight's verification checklist (run this before sleeping)

- [ ] `docker compose up --build` succeeds, backend container reaches Ollama on the host
- [ ] `llama3.1:8b` pulled and generates a real response in under 5 seconds for a short prompt
- [ ] ChromaDB initializes inside the container with zero build errors
- [ ] BGE embeddings run successfully on CPU for a small batch of text (confirms Section 3's fallback path works, not just theorized)
- [ ] XGBoost installs and trains a trivial model inside the container without error
- [ ] Power BI Desktop installed and opens a `.pbix` connected to a local CSV with no cloud sign-in prompt
- [ ] GitHub repo access confirmed for all three members
