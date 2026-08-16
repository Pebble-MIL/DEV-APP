from fastapi import APIRouter, Request, HTTPException
from app.models.schemas import ChecklistEvaluation
from app.services.firebase import get_collection, get_batch
from app.services.ai_pebble import evaluate_checklist
from app.seed_data import SCENARIOS

router = APIRouter(prefix="/api/checklist", tags=["checklist"])


@router.post("/evaluate")
async def evaluate(body: ChecklistEvaluation, request: Request):
    uid = request.state.uid
    answers_dicts = [a.model_dump() for a in body.answers]

    scenario = next((s for s in SCENARIOS if s["id"] == body.scenarioId), None)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")

    result = await evaluate_checklist(body.scenarioId, answers_dicts, body.foundClueIds)

    users_ref = get_collection("users")
    user_doc_ref = users_ref.document(uid)
    pebbles_ref = user_doc_ref.collection("pebbles")

    batch = get_batch()
    awarded = []

    for i, ev in enumerate(result.get("evaluations", [])):
        if ev.get("award_pebble"):
            clue_id = body.foundClueIds[i] if i < len(body.foundClueIds) else f"clue_{i}"
            pebble_data = {
                "category": ev.get("pebble_color_category", "privacidad"),
                "colorCode": _category_color(ev.get("pebble_color_category", "privacidad")),
                "scenarioId": body.scenarioId,
                "checklistAnswers": answers_dicts,
                "awardedByAI": True,
                "earnedAt": None,
                "feedback": ev.get("pebble_feedback_text", ""),
                "clueId": clue_id,
            }
            new_pebble_ref = pebbles_ref.document()
            batch.set(new_pebble_ref, pebble_data)
            awarded.append(pebble_data)

    user_doc = user_doc_ref.get()
    current_total = user_doc.to_dict().get("totalPebbles", 0) if user_doc and user_doc.exists else 0
    batch.update(user_doc_ref, {"totalPebbles": current_total + len(awarded)})

    batch.commit()

    return {
        "evaluations": result.get("evaluations", []),
        "awardedCount": len(awarded),
        "totalPebbles": current_total + len(awarded),
    }


def _category_color(category: str) -> str:
    palette = {
        "privacidad": "#097dac",
        "impulsividad": "#fd6e58",
        "datos_sensibles": "#f9bc46",
    }
    return palette.get(category, "#82cfff")
