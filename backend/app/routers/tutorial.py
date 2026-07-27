from fastapi import APIRouter
from app.seed_data import TUTORIAL_SCENARIO

router = APIRouter(prefix="/api/tutorial", tags=["tutorial"])


@router.get("/scenario")
async def get_tutorial():
    return TUTORIAL_SCENARIO
