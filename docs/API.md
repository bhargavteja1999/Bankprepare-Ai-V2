# BankPrepare AI — API Specification

Base URL: `http://localhost:8000/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
Register a new user account.
- **Request Body**:
  ```json
  {
    "email": "candidate@example.com",
    "password": "SecurePassword123!",
    "full_name": "Arjun Sharma",
    "target_exam": "IBPS PO"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "user": {
      "id": 1,
      "email": "candidate@example.com",
      "full_name": "Arjun Sharma",
      "target_exam": "IBPS PO",
      "is_active": true
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer"
  }
  ```

### `POST /auth/login`
Authenticate user and receive a JWT.
- **Request Body**:
  ```json
  {
    "email": "candidate@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` (User payload + Bearer token)

### `GET /auth/me`
Retrieve authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User details + statistics summary.

---

## 2. Document Management Endpoints (`/documents`)

### `POST /documents/upload`
Upload a document (PDF, DOCX, TXT) for parsing and quiz generation.
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `file`: (binary)
  - `title`: "Banking Awareness - RBI Monetary Policy"
  - `subject`: "General/Banking Awareness"
  - `target_exam`: "SBI PO"
- **Response**: `201 Created`
  ```json
  {
    "id": 1,
    "title": "Banking Awareness - RBI Monetary Policy",
    "file_type": "pdf",
    "file_size": 240500,
    "word_count": 3400,
    "extracted_text_preview": "Reserve Bank of India Monetary Policy Framework...",
    "status": "processed",
    "created_at": "2026-09-28T10:00:00Z"
  }
  ```

### `GET /documents`
List all uploaded documents for the user with search & filter params.

### `GET /documents/{id}`
Get details and extracted text of a specific document.

### `DELETE /documents/{id}`
Delete an uploaded document.

---

## 3. Quizzes & Questions (`/quizzes`)

### `POST /quizzes/generate`
AI-generate a quiz from an uploaded document or raw topic.
- **Request Body**:
  ```json
  {
    "document_id": 1,
    "topic": "RBI Repo Rate & Reverse Repo Rate",
    "num_questions": 10,
    "difficulty": "medium",
    "question_types": ["mcq", "true_false", "fill_blank"],
    "negative_marking": 0.25,
    "time_limit_minutes": 15
  }
  ```

### `GET /quizzes`
List all quizzes created by or available to the user.

### `GET /quizzes/{id}`
Get quiz full structure with questions and choices.

### `POST /quizzes/{id}/submit`
Submit candidate responses and compute score, accuracy, and explanations.
- **Request Body**:
  ```json
  {
    "time_taken_seconds": 450,
    "answers": [
      { "question_id": 101, "selected_option_index": 2 },
      { "question_id": 102, "text_response": "Inflation Targeting" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "attempt_id": 42,
    "score": 8.75,
    "total_marks": 10.0,
    "correct_count": 9,
    "incorrect_count": 1,
    "unattempted_count": 0,
    "accuracy_percentage": 90.0,
    "questions_review": [...]
  }
  ```

---

## 4. Flashcards (`/flashcards`)

### `POST /flashcards/generate`
Generate a deck of flashcards from a document or topic.

### `GET /flashcards/decks`
List all flashcard decks.

### `POST /flashcards/{id}/review`
Record card mastery score (`again`, `hard`, `good`, `easy`) for spaced repetition.

---

## 5. Banking Syllabus & Games (`/syllabus`, `/games`)

### `GET /syllabus/tree`
Fetch standard banking exam structured curriculum (Quantitative, Reasoning, English, GA, Computer).

### `GET /games/speed-challenge`
Generate rapid-fire 60-second banking math/reasoning drills.

---

## 6. Analytics (`/analytics`)

### `GET /analytics/dashboard`
Summary stats: total quizzes taken, overall accuracy %, study time, streak count, recent test scores.

### `GET /analytics/subject-breakdown`
Topic-level performance chart metrics for quantitative, reasoning, English, and GA.
