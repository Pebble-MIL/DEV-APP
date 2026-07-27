from fastapi import APIRouter, Request
from app.models.schemas import FirebaseToken, UserResponse
from app.services.firebase import verify_token, get_collection

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/verify")
async def verify(body: FirebaseToken, request: Request):
    user = verify_token(body.id_token)
    if user is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid token")

    uid = user.get("uid")
    users_ref = get_collection("users")
    user_doc = users_ref.document(uid).get()

    if not user_doc or not user_doc.exists:
        users_ref.document(uid).set({
            "displayName": user.get("email", "Explorador"),
            "ageRange": "8-10",
            "parentEmail": None,
            "createdAt": None,
            "nestLevel": "playa",
            "totalPebbles": 0,
            "unlockedIslandIds": ["isla_bahia_calma"],
        })

    return {"uid": uid, "status": "ok"}
