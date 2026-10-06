import json
from typing import Any, Dict

def safe_parse_json(text: str) -> Any:
    # Try direct parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # Try removing markdown code blocks ```json ... ```
    if "```" in text:
        blocks = text.split("```")
        for b in blocks:
            cleaned = b.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()
            try:
                return json.loads(cleaned)
            except Exception:
                continue
    return None
