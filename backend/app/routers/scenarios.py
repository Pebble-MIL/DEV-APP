from fastapi import APIRouter, Request, HTTPException
from app.models.schemas import ScenarioAttempt
from app.services.firebase import get_collection
from app.seed_data import SCENARIOS

router = APIRouter(prefix="/api/scenarios", tags=["scenarios"])


def _load_scenarios():
    """Load from in-memory seed data (Firebase fallback)."""
    return SCENARIOS


@router.get("/next")
async def get_next_scenario(request: Request):
    uid = request.state.uid
    users_ref = get_collection("users")
    user_doc = users_ref.document(uid).get()

    if not user_doc or not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()
    level = user_data.get("nestLevel", "playa")

    completed_ref = users_ref.document(uid).collection("pebbles")
    completed_ids = {d.to_dict().get("scenarioId") for d in completed_ref.stream() if d.exists}

    scenarios = _load_scenarios()
    available = [s for s in scenarios if s["nestLevelTarget"] == level and s["id"] not in completed_ids]

    if not available:
        return {"message": "No more scenarios. Check back later!", "done": True}

    scenario = available[0]
    return {
        "id": scenario["id"],
        "type": scenario["type"],
        "mediaUrl": scenario.get("mediaUrl", ""),
        "promptText": scenario["promptText"],
        "difficulty": scenario.get("difficulty", 1),
        "hiddenClues": [
            {"clueId": c["clueId"], "category": c["category"],
             "coordinates": c.get("coordinates"), "textSpan": c.get("textSpan")}
            for c in scenario.get("hiddenClues", [])
        ],
    }


@router.post("/{scenario_id}/attempt")
async def attempt_scenario(scenario_id: str, body: ScenarioAttempt, request: Request):
    scenarios = _load_scenarios()
    scenario = next((s for s in scenarios if s["id"] == scenario_id), None)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    for clue in scenario.get("hiddenClues", []):
        coord = clue.get("coordinates")
        span = clue.get("textSpan")
        if coord and body.x is not None and body.y is not None:
            dx = body.x - coord["x"]
            dy = body.y - coord["y"]
            distance = (dx ** 2 + dy ** 2) ** 0.5
            if distance <= coord.get("radius", 30):
                return {
                    "found": True,
                    "clueId": clue["clueId"],
                    "category": clue["category"],
                    "explanation": clue["explanation"],
                }
        if span and body.textStart is not None and body.textEnd is not None:
            if body.textStart >= span["start"] and body.textEnd <= span["end"]:
                return {
                    "found": True,
                    "clueId": clue["clueId"],
                    "category": clue["category"],
                    "explanation": clue["explanation"],
                }

    return {"found": False, "clueId": None, "explanation": "No hay pista aquí. ¡Sigue buscando!"}
