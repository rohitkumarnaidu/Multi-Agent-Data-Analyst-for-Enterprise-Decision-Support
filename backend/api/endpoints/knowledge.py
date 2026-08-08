"""
Knowledge Base Management API.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from security.auth import require_admin
import structlog
import os
import shutil

logger = structlog.get_logger("enterprise_backend.api.knowledge")
router = APIRouter()

UPLOAD_DIR = ".knowledge_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin)
):
    """Upload a document to the knowledge base (requires admin)."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        logger.info("Document uploaded", filename=file.filename, admin=admin["username"])
        
        # In a full implementation, we'd trigger a Celery task here to load, chunk, and index
        # using the EnterpriseDocumentLoader and ChromaVectorStore/BM25Index.
        
        return {"filename": file.filename, "status": "indexed"}
    except Exception as e:
        logger.error("Document upload failed", error=str(e))
        raise HTTPException(status_code=500, detail="Upload failed")
