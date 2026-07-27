import json
import logging
import httpx
from app.config import OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Eres Pebble, un pingüino joven, torpe y curioso, ayudante en aprender sobre buen uso de información en línea. Hablas siempre en primera persona, con calidez, nunca regañas. Tu tono es el de alguien aprendiendo junto al niño, no el de un evaluador.

Reglas estrictas:
- Nunca uses palabras como "riesgo", "peligro", "vulnerabilidad", "amenaza", "exposición".
- Usa el vocabulario del universo Pebble: piedritas, nido, pistas, colonia, hielo.
- Si la decisión del niño en el checklist fue correcta, celebra de forma breve y específica (qué hizo bien, no solo "bien hecho").
- Si la decisión fue incorrecta, no la señales como error — ofrece una alternativa ("la próxima vez podríamos intentar...") y NO otorgues la piedrita en ese caso.
- Responde siempre en JSON estructurado, nunca en prosa libre fuera del JSON.
- Nunca menciones que eres una IA, un modelo de lenguaje, o que esto es una evaluación."""


async def evaluate_checklist(scenario_id: str, answers: list[dict], found_clue_ids: list[str]) -> dict:
    if not OPENROUTER_API_KEY:
        return _fallback_evaluation(answers)

    user_message = _build_user_message(scenario_id, answers, found_clue_ids)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": OPENROUTER_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    "response_format": {"type": "json_object"},
                },
            )
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            result = json.loads(content)
            logger.info(f"AI evaluation result: {result}")
            return result
    except Exception as e:
        logger.error(f"AI evaluation failed: {e}")
        return _fallback_evaluation(answers)


def _build_user_message(scenario_id: str, answers: list[dict], found_clue_ids: list[str]) -> str:
    answers_text = "\n".join(
        f"- Pregunta: {a['question']}\n  Decisión del niño: {a['userChoice']}"
        for a in answers
    )
    return f"""Escenario: {scenario_id}
Pistas encontradas: {', '.join(found_clue_ids)}

El niño ayudó a Pebble con estas decisiones:
{answers_text}

Evalúa cada decisión. Para cada una, decide si se otorga una piedrita.
Responde en JSON con este formato:
{{
  "evaluations": [
    {{
      "award_pebble": true,
      "pebble_color_category": "privacidad" | "impulsividad" | "datos_sensibles",
      "pebble_feedback_text": "texto de Pebble en primera persona celebrando o sugiriendo",
      "tone": "celebratory" | "thoughtful"
    }}
  ]
}}"""


def _fallback_evaluation(answers: list[dict]) -> dict:
    evaluations = []
    for a in answers:
        is_correct = "bien" in a["userChoice"].lower() or "solo" in a["userChoice"].lower() or "mejor" in a["userChoice"].lower() or "respira" in a["userChoice"].lower()
        evaluations.append({
            "award_pebble": is_correct,
            "pebble_color_category": "privacidad",
            "pebble_feedback_text": (
                "¡Lo logramos! Esa piedrita brilla mucho en nuestro nido. "
                "Aprendimos juntos a cuidar nuestra información."
                if is_correct
                else "Hmm, la próxima vez podríamos pensarlo un poco más antes de compartir. ¡Seguimos aprendiendo!"
            ),
            "tone": "celebratory" if is_correct else "thoughtful",
        })
    return {"evaluations": evaluations}


async def generate_pebble_reaction(feedback_text: str, tone: str) -> str:
    return feedback_text
