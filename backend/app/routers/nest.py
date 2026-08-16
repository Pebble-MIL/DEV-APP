from fastapi import APIRouter, Request, HTTPException
from app.services.firebase import get_collection
from app.seed_data import ISLANDS

router = APIRouter(prefix="/api/nest", tags=["nest"])


@router.get("/{uid}")
async def get_nest(uid: str, request: Request):
    users_ref = get_collection("users")
    user_doc = users_ref.document(uid).get()

    if not user_doc or not user_doc.exists:
        return {
            "pebbles": [],
            "totalPebbles": 0,
            "nestLevel": "playa",
            "unlockedIslands": [],
            "nextIsland": None,
        }

    user_data = user_doc.to_dict() or {}
    pebbles = []
    pebbles_ref = users_ref.document(uid).collection("pebbles")
    for p in pebbles_ref.stream():
        if hasattr(p, 'to_dict'):
            pebbles.append(p.to_dict())

    unlocked_ids = set(user_data.get("unlockedIslandIds", []))
    unlocked = [i for i in ISLANDS if i["id"] in unlocked_ids]
    total = user_data.get("totalPebbles", 0)

    next_island = None
    for i in ISLANDS:
        if i["id"] not in unlocked_ids:
            if i["requiredPebbles"] > 0:
                progress = min(100, int(total / i["requiredPebbles"] * 100))
            else:
                progress = 100
            next_island = {**i, "progress": progress}
            break

    return {
        "pebbles": pebbles,
        "totalPebbles": total,
        "nestLevel": user_data.get("nestLevel", "playa"),
        "unlockedIslands": unlocked,
        "nextIsland": next_island,
    }
