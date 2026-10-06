# BankPrepare AI — Architecture & Design

## 🏛️ System Architecture

```mermaid
flowchart TD
    User([Student / Aspirant]) -->|Interacts| Frontend[React 18 + Vite SPA]
    
    subgraph Frontend Layer
        Frontend --> Router[React Router DOM]
        Router --> Pages[Pages: Dashboard, Quiz, Documents, Flashcards, Syllabus]
        Pages --> Contexts[AuthContext & AppContext]
        Contexts --> ApiClient[Axios Client with JWT Interceptors]
    end

    ApiClient -->|REST JSON + JWT| Backend[FastAPI API Gateway]

    subgraph Backend Layer
        Backend --> CORS[CORS & Security Middleware]
        CORS --> Routers[API Routers: Auth, Docs, Quizzes, Flashcards, Syllabus, Analytics]
        Routers --> Services[Domain Services]
        
        subgraph Domain Services
            Services --> DocProc[Document Processor: PyPDF / Docx / Text]
            Services --> AIGen[AI Generator: Google Gemini API / Fallback Logic]
            Services --> QuizSvc[Quiz Scoring & Exam Logic]
            Services --> FlashSvc[Spaced Repetition Flashcard Logic]
            Services --> StatSvc[Analytics & Performance Tracker]
        end

        Services --> DB[(SQLAlchemy ORM + SQLite / PostgreSQL)]
    end

    AIGen -->|JSON Extraction Prompts| Gemini[Google Gemini LLM Engine]
```

---

## 🔑 Key Design Decisions

1. **FastAPI & Async Support**: Chosen for high throughput, automatic OpenAPI documentation, and native Pydantic schema validation.
2. **Modular Service Layer**: Business logic is separated into dedicated services (`document_processor.py`, `ai_generator.py`, `quiz_service.py`), allowing straightforward unit testing and replacement of AI providers.
3. **Structured Prompt Engineering**: Gemini prompts enforce strict JSON schemas for MCQ options, explanations, references, and difficulty levels, preventing parsing errors.
4. **Fallback Resilience**: When an external AI key is absent or offline, an intelligent heuristic question generator supplies banking test questions so users can test immediately.
5. **State Management in React**: Clean React Contexts (`AuthContext` and `AppContext`) paired with custom hooks (`useAuth`, `useApi`) ensure predictable UI state and token synchronization.
