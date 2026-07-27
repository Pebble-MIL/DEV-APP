"""
Seed script for Pebble — loads scenarios and islands into Firestore.

Usage:
    python seed/seed_firestore.py

Requires:
    - GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account JSON
    - Or firebase_admin initialized via default credentials
"""

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    print("firebase-admin not installed. Run: pip install firebase-admin")
    sys.exit(1)

SEED_DIR = Path(__file__).parent


def init_firebase():
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path and Path(cred_path).exists():
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
    return firestore.client()


def load_json(filename: str) -> list[dict]:
    path = SEED_DIR / filename
    if not path.exists():
        print(f"File not found: {path}")
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_collection(db, collection_name: str, data: list[dict], id_field: str = "id"):
    col_ref = db.collection(collection_name)
    count = 0
    for item in data:
        doc_id = str(item[id_field])
        col_ref.document(doc_id).set(item)
        count += 1
        print(f"  ✓ {collection_name}/{doc_id}")
    return count


def main():
    print("🌊 Pebble — Seed Script")
    print("========================")

    db = init_firebase()
    print("✓ Firebase connected\n")

    scenarios = load_json("scenarios.json")
    islands = load_json("islands.json")

    print(f"📦 Seeding {len(scenarios)} scenarios...")
    s_count = seed_collection(db, "scenarios", scenarios)
    print(f"  → {s_count} scenarios created\n")

    print(f"📦 Seeding {len(islands)} islands...")
    i_count = seed_collection(db, "islands", islands)
    print(f"  → {i_count} islands created\n")

    # Tutorial scenario (hardcoded)
    tutorial = {
        "id": "tutorial_01",
        "type": "photo",
        "nestLevelTarget": "playa",
        "mediaUrl": "",
        "promptText": "¡Mira esta foto que tomé! ¿Puedes ayudarme a encontrar qué cosas deberíamos revisar antes de publicarla?",
        "hiddenClues": [
            {
                "clueId": "tutorial_clue_1",
                "category": "privacidad",
                "coordinates": {"x": 200, "y": 150, "radius": 40},
                "explanation": "¡Aquí hay una ventana! Si se ve mi cueva, otros pingüinos sabrían dónde vivo.",
            }
        ],
        "difficulty": 1,
    }
    db.collection("scenarios").document("tutorial_01").set(tutorial)
    print("  ✓ scenarios/tutorial_01 (tutorial)")

    print("\n✅ Seed complete!")


if __name__ == "__main__":
    main()
