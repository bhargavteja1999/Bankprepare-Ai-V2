import re

def validate_password_strength(password: str) -> bool:
    if len(password) < 6:
        return False
    return True

def clean_text_content(text: str) -> str:
    # Remove excessive blank lines and non-printable characters
    cleaned = re.sub(r'\r\n|\r', '\n', text)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned.strip()
