import os
import shutil
from typing import Tuple
from fastapi import UploadFile, HTTPException

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}

def save_uploaded_file(upload_file: UploadFile, upload_dir: str) -> Tuple[str, str, int]:
    os.makedirs(upload_dir, exist_ok=True)
    filename = upload_file.filename or "uploaded_document"
    ext = os.path.splitext(filename)[1].lower()
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate clean unique storage path
    import uuid
    safe_filename = f"{uuid.uuid4().hex[:10]}_{filename}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    file_size = os.path.getsize(file_path)
    file_type = ext.replace(".", "")
    return file_path, file_type, file_size
