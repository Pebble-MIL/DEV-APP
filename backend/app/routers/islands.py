from fastapi import APIRouter, Request, HTTPException
from app.services.firebase import get_collection
from app.seed_data import ISLANDS

router = APIRouter(prefix="/api/islands", tags=["islands"])


@router.post("/unlock-check")
async def unlock_check(request: Request):
    uid = request.state.uid
    users_ref = get_collection("users")
    user_doc = users_ref.document(uid).get()

    if not user_doc or not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    total = user_data.get("totalPebbles", 0)
    unlocked_ids = set(user_data.get("unlockedIslandIds", []))
    new_unlocks = []

    for island in ISLANDS:
        if island["id"] not in unlocked_ids and total >= island["requiredPebbles"]:
            unlocked_ids.add(island["id"])
            new_unlocks.append(island)

    if new_unlocks:
        users_ref.document(uid).update({
            "unlockedIslandIds": list(unlocked_ids),
        })

    return {
        "newUnlocks": new_unlocks,
        "unlockedIslandIds": list(unlocked_ids),
    }
