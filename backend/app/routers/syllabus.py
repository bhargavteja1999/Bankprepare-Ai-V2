from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/syllabus", tags=["Syllabus"])

BANKING_SYLLABUS = [
    {
        "id": 1,
        "name": "Quantitative Aptitude",
        "code": "QUANT",
        "icon": "Calculator",
        "weightage_percent": 35,
        "topics": [
            {"id": 101, "name": "Data Interpretation (Pie, Bar, Line, Radar)", "difficulty": "Hard", "progress": 65, "completed": False},
            {"id": 102, "name": "Simplification & Approximation", "difficulty": "Easy", "progress": 100, "completed": True},
            {"id": 103, "name": "Quadratic Equations", "difficulty": "Easy", "progress": 90, "completed": True},
            {"id": 104, "name": "Number Series (Missing & Wrong)", "difficulty": "Medium", "progress": 50, "completed": False},
            {"id": 105, "name": "Profit, Loss & Discount", "difficulty": "Medium", "progress": 70, "completed": False},
            {"id": 106, "name": "Simple & Compound Interest", "difficulty": "Hard", "progress": 40, "completed": False},
            {"id": 107, "name": "Time, Speed & Distance / Trains", "difficulty": "Hard", "progress": 30, "completed": False},
            {"id": 108, "name": "Time & Work / Pipes & Cisterns", "difficulty": "Medium", "progress": 80, "completed": False}
        ]
    },
    {
        "id": 2,
        "name": "Reasoning Ability",
        "code": "REASONING",
        "icon": "BrainCircuit",
        "weightage_percent": 35,
        "topics": [
            {"id": 201, "name": "Seating Arrangement (Circular, Linear, Square)", "difficulty": "Hard", "progress": 60, "completed": False},
            {"id": 202, "name": "Floor & Box Puzzles", "difficulty": "Hard", "progress": 45, "completed": False},
            {"id": 203, "name": "Syllogism (Only A Few, Reverse)", "difficulty": "Medium", "progress": 90, "completed": True},
            {"id": 204, "name": "Inequalities (Direct & Coded)", "difficulty": "Easy", "progress": 100, "completed": True},
            {"id": 205, "name": "Blood Relations", "difficulty": "Medium", "progress": 75, "completed": False},
            {"id": 206, "name": "Direction Sense", "difficulty": "Easy", "progress": 85, "completed": False},
            {"id": 207, "name": "Coding-Decoding (New Pattern)", "difficulty": "Medium", "progress": 60, "completed": False}
        ]
    },
    {
        "id": 3,
        "name": "English Language",
        "code": "ENGLISH",
        "icon": "BookOpen",
        "weightage_percent": 30,
        "topics": [
            {"id": 301, "name": "Reading Comprehension (Financial Context)", "difficulty": "Hard", "progress": 70, "completed": False},
            {"id": 302, "name": "Cloze Test", "difficulty": "Medium", "progress": 80, "completed": False},
            {"id": 303, "name": "Error Spotting & Grammar", "difficulty": "Medium", "progress": 65, "completed": False},
            {"id": 304, "name": "Para Jumbles / Sentence Rearrangement", "difficulty": "Hard", "progress": 55, "completed": False},
            {"id": 305, "name": "Fillers & Word Swap", "difficulty": "Easy", "progress": 90, "completed": True}
        ]
    },
    {
        "id": 4,
        "name": "Banking & Financial Awareness",
        "code": "GA_BANKING",
        "icon": "Landmark",
        "weightage_percent": 40,
        "topics": [
            {"id": 401, "name": "RBI Structure, Functions & Monetary Policy", "difficulty": "Medium", "progress": 85, "completed": False},
            {"id": 402, "name": "Banking Regulation Act & History", "difficulty": "Easy", "progress": 75, "completed": False},
            {"id": 403, "name": "NPA, IBC 2016 & SARFAESI Act", "difficulty": "Hard", "progress": 50, "completed": False},
            {"id": 404, "name": "Financial Inclusion, PMJDY & Priority Sector Lending", "difficulty": "Medium", "progress": 95, "completed": True},
            {"id": 405, "name": "Payment Systems (UPI, NEFT, RTGS, IMPS, CBDC)", "difficulty": "Medium", "progress": 90, "completed": True}
        ]
    }
]

@router.get("/tree")
def get_syllabus_tree(current_user: User = Depends(get_current_user)):
    return {
        "exam": current_user.target_exam or "IBPS PO / SBI PO",
        "subjects": BANKING_SYLLABUS
    }
