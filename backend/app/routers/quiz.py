from fastapi import APIRouter, Request
from app.models.schemas import QuizSubmission
from app.services.firebase import get_collection

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

QUIZ_QUESTIONS = [
    {
        "id": "q1",
        "category": "privacidad",
        "options": {
            "A": {"text": "¡Sí! Así todos ven dónde vives", "points": 0},
            "B": {"text": "Mejor solo la roca, tu cueva es tuya", "points": 2},
            "C": {"text": "No sé, ¿importa?", "points": 1},
        },
    },
    {
        "id": "q2",
        "category": "impulsividad",
        "options": {
            "A": {"text": "Cuéntalo ya, que todos sepan", "points": 0},
            "B": {"text": "Respira primero, y después decides si lo cuentas", "points": 2},
            "C": {"text": "Cuéntaselo solo a tu mejor amigo", "points": 1},
        },
    },
    {
        "id": "q3",
        "category": "datos_sensibles",
        "options": {
            "A": {"text": "Sí, es de buena educación responder", "points": 0},
            "B": {"text": "Puedes decirle tu nombre de juego, pero lo demás no", "points": 2},
            "C": {"text": "Respóndele solo dónde nadas", "points": 0},
        },
    },
]

QUIZ_QUESTIONS_BY_ID = {q["id"]: q for q in QUIZ_QUESTIONS}


@router.post("/submit")
async def submit_quiz(body: QuizSubmission, request: Request):
    uid = getattr(request.state, "uid", "dev-user")
    total = 0
    detailed = []

    for ans in body.answers:
        q = QUIZ_QUESTIONS_BY_ID.get(ans.questionId)
        if q and ans.optionSelected in q["options"]:
            points = q["options"][ans.optionSelected]["points"]
            total += points
            detailed.append({
                "questionId": ans.questionId,
                "optionSelected": ans.optionSelected,
                "points": points,
            })

    if total <= 2:
        level = "playa"
    elif total <= 4:
        level = "acantilado"
    else:
        level = "glaciar"

    users_ref = get_collection("users")
    users_ref.document(uid).update({
        "nestLevel": level,
        "totalPebbles": 0,
    })

    quiz_ref = users_ref.document(uid).collection("quizResults")
    quiz_ref.document("initial").set({
        "answers": detailed,
        "totalScore": total,
        "nestLevelAssigned": level,
    })

    return {
        "totalScore": total,
        "nestLevel": level,
        "detailed": detailed,
    }
