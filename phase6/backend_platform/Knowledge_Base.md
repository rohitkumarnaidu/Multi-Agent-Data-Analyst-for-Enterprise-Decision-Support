# Knowledge Base

## Supported Ingestion
- `PyPDFLoader` for unstructured text from PDF files.
- `UnstructuredMarkdownLoader` for internal documentation.
- `CSVLoader` for tabular heuristics.

Chunking relies on `RecursiveCharacterTextSplitter` with 1000 characters and 200 overlap to maintain semantic continuity.
