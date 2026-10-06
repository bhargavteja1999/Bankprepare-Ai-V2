# Test Suite Documentation

This directory and the `backend/tests` suite contain automated tests for verifying all business logic and API endpoints.

## 🧪 Running Backend Tests

Navigate to the `backend/` folder and run pytest:

```bash
cd backend
pytest -v
```

### Test Coverage Areas:
1. **Authentication (`backend/tests/test_auth.py`)**: User registration, login, JWT token verification, and password hashing.
2. **Documents (`backend/tests/test_documents.py`)**: Document parsing (PDF, DOCX, TXT text extraction) and storage.
3. **Quizzes (`backend/tests/test_quizzes.py`)**: Question generation, quiz submission, negative marking calculation, score accuracy.
4. **Flashcards (`backend/tests/test_flashcards.py`)**: Flashcard deck creation and spaced repetition review progression.
