# BankPrepare AI — Document-to-Interactive Quiz & Exam Prep Generator

BankPrepare AI is a comprehensive full-stack platform that transforms study materials, syllabus documents, and banking exam PDFs into interactive quizzes, structured flashcards, gamified challenges, and in-depth performance analytics.

---

## 🌟 Key Features

1. **Document Ingestion & AI Parsing**: Upload PDF, DOCX, and TXT documents. The system extracts structured content, identifies banking exam topics, and processes key concepts.
2. **AI-Powered Quiz Generation**: Generate multiple question formats (Single-choice MCQ, Multiple-choice, True/False, Fill-in-the-blanks, Match-the-following) with detailed explanations and difficulty levels (Easy, Medium, Hard).
3. **Interactive Quiz Taker & Editor**: Complete with live timers, negative marking support (standard banking exam pattern), instant grading, and answer reviews.
4. **Flashcard Deck Generator**: Spaced-repetition flashcards derived automatically from study notes and uploaded documents.
5. **Interactive Syllabus Roadmap**: Visual banking syllabus tree covering Quantitative Aptitude, Reasoning Ability, English Language, General/Banking Awareness, and Computer Aptitude.
6. **Gamified Practice**: Speed-quiz challenges and streak trackers to boost retention and engagement.
7. **Performance Analytics**: Visual score trends, accuracy by subject/topic, time-spent metrics, and personalized weak-area recommendations.

---

## 📂 Architecture Overview

```
bankprepare-ai/
├── frontend/             # React (Vite) + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/   # Common UI, Quiz, Layout, Syllabus, and Dashboard widgets
│   │   ├── pages/        # Auth, Dashboard, Documents, Quizzes, Flashcards, Syllabus, Games
│   │   ├── services/     # Axios API layer and domain services
│   │   ├── context/      # AuthContext & AppContext
│   │   └── hooks/        # Custom React hooks (useAuth, useApi)
│
├── backend/              # FastAPI + SQLAlchemy + SQLite/PostgreSQL + Gemini AI
│   ├── app/
│   │   ├── core/         # Security (JWT, bcrypt), config, and dependencies
│   │   ├── database/     # DB Session and base models
│   │   ├── models/       # User, Document, Quiz, Question, Flashcard, Syllabus, Analytics
│   │   ├── schemas/      # Pydantic schemas for request/response validation
│   │   ├── routers/      # Modular REST endpoints
│   │   ├── services/     # Document parser, Gemini AI generator, quiz & analytics logic
│   │   └── utils/        # Helper functions, validators, file utilities
│
├── docs/                 # API, Architecture, and Database documentation
└── tests/                # Automated backend test suites
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

---

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create & activate virtual environment**:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and supply your GEMINI_API_KEY if AI generation is needed
   ```

5. **Run the backend server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *FastAPI docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start Vite development server**:
   ```bash
   npm run dev
   ```
   *Frontend web app will run at [http://localhost:5173](http://localhost:5173).*

---

### Running with Docker

```bash
docker-compose up --build
```

---

## 🔒 Authentication & API Security
- **JWT Authentication** (Bearer Token) using `python-jose` and `passlib[bcrypt]`.
- Token expires in 7 days by default (configurable).
- Protected endpoints require `Authorization: Bearer <access_token>`.

---

## 📄 License
MIT License.
