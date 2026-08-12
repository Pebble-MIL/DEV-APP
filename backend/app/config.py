import os
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "pebble-mil-app")
FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

if ENVIRONMENT == "production":
    missing_keys = []
    if not FIREBASE_PRIVATE_KEY:
        missing_keys.append("FIREBASE_PRIVATE_KEY")
    if not FIREBASE_CLIENT_EMAIL:
        missing_keys.append("FIREBASE_CLIENT_EMAIL")
    if not OPENROUTER_API_KEY:
        missing_keys.append("OPENROUTER_API_KEY")

    if missing_keys:
        raise ValueError(f"Missing critical environment variables in production: {', '.join(missing_keys)}")

OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-chat")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
