import json
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.utils.helpers import safe_parse_json

logger = logging.getLogger(__name__)

class AIGenerator:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    def _get_gemini_client(self):
        if not self.api_key:
            return None
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            return genai.GenerativeModel(self.model_name)
        except Exception as e:
            logger.warning(f"Failed to initialize Gemini AI client: {e}")
            return None

    def generate_quiz(
        self,
        document_text: str,
        topic: str,
        subject: str,
        num_questions: int = 5,
        difficulty: str = "medium",
        question_types: List[str] = None
    ) -> List[Dict[str, Any]]:
        if question_types is None:
            question_types = ["mcq"]

        prompt = f"""
You are an expert banking exam paper creator (IBPS PO, SBI PO, RBI Grade B).
Based on the following content or topic, create exactly {num_questions} high-quality questions for subject '{subject}', topic '{topic}', difficulty '{difficulty}'.
Supported question types: {', '.join(question_types)}.

Content Context:
{document_text[:6000] if document_text else 'Topic: ' + topic + ' in Banking Exam Prep'}

CRITICAL: Return ONLY a valid JSON array of question objects. Do not include markdown wraps or conversational text.
JSON Structure per item:
[
  {{
    "question_text": "What is the primary objective of RBI's Monetary Policy Committee (MPC)?",
    "question_type": "mcq",
    "marks": 1.0,
    "negative_marks": 0.25,
    "explanation": "The primary objective of the MPC under RBI Act is to maintain price stability while keeping in mind the objective of growth.",
    "reference_note": "Section 45ZB of RBI Act, 1934",
    "options": [
      {{ "option_text": "Maintaining price stability while supporting growth", "is_correct": true }},
      {{ "option_text": "Regulating equity stock exchanges like NSE and BSE", "is_correct": false }},
      {{ "option_text": "Printing currency notes exceeding 1 lakh crore", "is_correct": false }},
      {{ "option_text": "Auditing international commercial transactions", "is_correct": false }}
    ]
  }}
]
"""
        client = self._get_gemini_client()
        if client:
            try:
                response = client.generate_content(prompt)
                parsed = safe_parse_json(response.text)
                if parsed and isinstance(parsed, list) and len(parsed) > 0:
                    return parsed[:num_questions]
            except Exception as e:
                logger.error(f"Gemini generation error: {e}. Falling back to heuristic generator.")

        # Fallback heuristic / sample banking questions
        return self._get_fallback_quiz(topic, subject, num_questions, difficulty)

    def generate_flashcards(
        self,
        document_text: str,
        topic: str,
        subject: str,
        num_cards: int = 8
    ) -> List[Dict[str, Any]]:
        prompt = f"""
You are an expert banking exam tutor. Create exactly {num_cards} spaced-repetition flashcards for subject '{subject}' and topic '{topic}'.
Content:
{document_text[:6000] if document_text else 'Topic: ' + topic}

Return ONLY a JSON array of objects:
[
  {{
    "front": "What does CRR stand for and who sets it?",
    "back": "Cash Reserve Ratio — the percentage of a bank's total deposits that must be maintained with the Reserve Bank of India in cash form.",
    "hint": "RBI Monetary Policy Tool"
  }}
]
"""
        client = self._get_gemini_client()
        if client:
            try:
                response = client.generate_content(prompt)
                parsed = safe_parse_json(response.text)
                if parsed and isinstance(parsed, list) and len(parsed) > 0:
                    return parsed[:num_cards]
            except Exception as e:
                logger.error(f"Gemini flashcard generation error: {e}")

        return self._get_fallback_flashcards(topic, num_cards)

    def _get_fallback_quiz(self, topic: str, subject: str, num_questions: int, difficulty: str) -> List[Dict[str, Any]]:
        sample_bank = [
            {
                "question_text": f"In the context of {topic or 'Banking Systems'}, what does the term 'Repo Rate' signify?",
                "question_type": "mcq",
                "marks": 1.0,
                "negative_marks": 0.25,
                "explanation": "Repo rate is the rate at which the central bank of a country (RBI in India) lends money to commercial banks in the event of any shortfall of funds.",
                "reference_note": "Monetary Policy Guidelines",
                "options": [
                    {"option_text": "The rate at which RBI lends short-term money to commercial banks against government securities", "is_correct": True},
                    {"option_text": "The interest rate banks pay to retail savings account holders", "is_correct": False},
                    {"option_text": "The rate at which commercial banks deposit excess funds with RBI", "is_correct": False},
                    {"option_text": "The penalty interest rate on bad loans and NPAs", "is_correct": False}
                ]
            },
            {
                "question_text": "Which institution acts as the lender of the last resort in the Indian financial system?",
                "question_type": "mcq",
                "marks": 1.0,
                "negative_marks": 0.25,
                "explanation": "The Reserve Bank of India (RBI) acts as the lender of the last resort to provide liquidity support to solvent commercial banks facing liquidity stress.",
                "reference_note": "RBI Functions and Powers",
                "options": [
                    {"option_text": "Reserve Bank of India (RBI)", "is_correct": True},
                    {"option_text": "State Bank of India (SBI)", "is_correct": False},
                    {"option_text": "Securities and Exchange Board of India (SEBI)", "is_correct": False},
                    {"option_text": "National Bank for Agriculture and Rural Development (NABARD)", "is_correct": False}
                ]
            },
            {
                "question_text": "True or False: Statutory Liquidity Ratio (SLR) can only be maintained strictly in cash form with the RBI.",
                "question_type": "true_false",
                "marks": 1.0,
                "negative_marks": 0.25,
                "explanation": "False. Unlike CRR which is kept in cash with RBI, SLR can be maintained by banks in cash, gold, or approved government securities with themselves.",
                "reference_note": "Banking Regulation Act, 1949",
                "options": [
                    {"option_text": "False", "is_correct": True},
                    {"option_text": "True", "is_correct": False}
                ]
            },
            {
                "question_text": "What is the maximum limit for a transaction under Immediate Payment Service (IMPS) per day as per recent NPCI guidelines?",
                "question_type": "mcq",
                "marks": 1.0,
                "negative_marks": 0.25,
                "explanation": "NPCI increased the per-transaction limit for IMPS from ₹2 lakh to ₹5 lakh.",
                "reference_note": "NPCI Payment Systems",
                "options": [
                    {"option_text": "₹5 Lakh", "is_correct": True},
                    {"option_text": "₹2 Lakh", "is_correct": False},
                    {"option_text": "₹10 Lakh", "is_correct": False},
                    {"option_text": "₹1 Lakh", "is_correct": False}
                ]
            },
            {
                "question_text": "Which formula correctly represents the calculation of Simple Interest?",
                "question_type": "mcq",
                "marks": 1.0,
                "negative_marks": 0.25,
                "explanation": "Simple Interest (SI) = (Principal * Rate * Time) / 100.",
                "reference_note": "Quantitative Aptitude: Commercial Math",
                "options": [
                    {"option_text": "SI = (P × R × T) / 100", "is_correct": True},
                    {"option_text": "SI = P × (1 + R/100)^T", "is_correct": False},
                    {"option_text": "SI = (P + R + T) / 100", "is_correct": False},
                    {"option_text": "SI = (P × R) / (100 × T)", "is_correct": False}
                ]
            }
        ]
        
        # Extend sample bank if more requested
        while len(sample_bank) < num_questions:
            idx = len(sample_bank) + 1
            sample_bank.append({
                "question_text": f"Question {idx} regarding {topic or 'Banking & Reasoning'}: Identify the correct core banking principle.",
                "question_type": "mcq",
                "marks": 1.0,
                "negative_marks": 0.25,
                "explanation": f"Core concept check for {topic or 'banking'}.",
                "reference_note": "Standard Banking Syllabus",
                "options": [
                    {"option_text": f"Correct principle statement for concept {idx}", "is_correct": True},
                    {"option_text": f"Incorrect distractor A for concept {idx}", "is_correct": False},
                    {"option_text": f"Incorrect distractor B for concept {idx}", "is_correct": False},
                    {"option_text": f"Incorrect distractor C for concept {idx}", "is_correct": False}
                ]
            })

        return sample_bank[:num_questions]

    def _get_fallback_flashcards(self, topic: str, num_cards: int) -> List[Dict[str, Any]]:
        samples = [
            {
                "front": "What is CRR (Cash Reserve Ratio)?",
                "back": "The percentage of a bank's total Net Demand and Time Liabilities (NDTL) that it must keep in cash with the Reserve Bank of India.",
                "hint": "Kept in cash with RBI"
            },
            {
                "front": "What is SLR (Statutory Liquidity Ratio)?",
                "back": "The reserve requirement that commercial banks in India must maintain in the form of cash, gold, or government approved securities before providing credit to customers.",
                "hint": "Maintained by banks themselves"
            },
            {
                "front": "What does PCA stand for in banking?",
                "back": "Prompt Corrective Action framework, used by RBI to maintain financial health of struggling banks.",
                "hint": "Triggered by capital, asset quality, or leverage"
            },
            {
                "front": "What is CASA Ratio?",
                "back": "Current Account Savings Account ratio. A higher CASA ratio means a lower cost of funds for the bank.",
                "hint": "Low-cost deposits"
            },
            {
                "front": "What is the full form of CTS in cheque processing?",
                "back": "Cheque Truncation System, an image-based cheque clearing mechanism introduced by RBI.",
                "hint": "Replaced physical cheque transport"
            }
        ]
        while len(samples) < num_cards:
            i = len(samples) + 1
            samples.append({
                "front": f"Key Term #{i} for {topic or 'Banking Exams'}",
                "back": f"Essential definition and exam-focused mnemonic for {topic or 'financial awareness'}.",
                "hint": "Revision aid"
            })
        return samples[:num_cards]

ai_generator = AIGenerator()
