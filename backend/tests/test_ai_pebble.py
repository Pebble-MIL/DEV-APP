import pytest
from unittest.mock import patch, MagicMock
from app.services.ai_pebble import evaluate_checklist, _fallback_evaluation

@pytest.mark.asyncio
@patch("app.services.ai_pebble.OPENROUTER_API_KEY", "dummy_key")
@patch("httpx.AsyncClient.post")
async def test_evaluate_checklist_exception_fallback(mock_post):
    mock_post.side_effect = Exception("Network error")

    scenario_id = "test_scenario"
    answers = [{"question": "Did you share?", "userChoice": "bien"}]
    found_clue_ids = []

    result = await evaluate_checklist(scenario_id, answers, found_clue_ids)

    assert "evaluations" in result
    assert len(result["evaluations"]) == 1
    assert result["evaluations"][0]["award_pebble"] is True

    answers_incorrect = [{"question": "Did you share?", "userChoice": "mal"}]
    result_incorrect = await evaluate_checklist(scenario_id, answers_incorrect, found_clue_ids)

    assert "evaluations" in result_incorrect
    assert len(result_incorrect["evaluations"]) == 1
    assert result_incorrect["evaluations"][0]["award_pebble"] is False

@pytest.mark.asyncio
@patch("app.services.ai_pebble.OPENROUTER_API_KEY", "dummy_key")
@patch("httpx.AsyncClient.post")
async def test_evaluate_checklist_http_error_fallback(mock_post):
    import httpx
    mock_post.side_effect = httpx.HTTPStatusError("500 Error", request=MagicMock(), response=MagicMock())

    scenario_id = "test_scenario"
    answers = [{"question": "Did you share?", "userChoice": "bien"}]
    found_clue_ids = []

    result = await evaluate_checklist(scenario_id, answers, found_clue_ids)

    assert "evaluations" in result
    assert len(result["evaluations"]) == 1
    assert result["evaluations"][0]["award_pebble"] is True

def test_fallback_evaluation_empty():
    assert _fallback_evaluation([]) == {"evaluations": []}

def test_fallback_evaluation_correct_keywords():
    answers = [
        {"userChoice": "Hice bien"},
        {"userChoice": "Lo hice solo"},
        {"userChoice": "Es mejor así"},
        {"userChoice": "Respira hondo"},
        {"userChoice": "BIEN"},
        {"userChoice": "SoLo"},
    ]
    result = _fallback_evaluation(answers)
    evaluations = result["evaluations"]
    assert len(evaluations) == 6
    for eval in evaluations:
        assert eval["award_pebble"] is True
        assert eval["pebble_color_category"] == "privacidad"
        assert eval["tone"] == "celebratory"
        assert "¡Lo logramos!" in eval["pebble_feedback_text"]

def test_fallback_evaluation_incorrect_keywords():
    answers = [
        {"userChoice": "No sé"},
        {"userChoice": "Compartir todo"},
        {"userChoice": "Malo"},
    ]
    result = _fallback_evaluation(answers)
    evaluations = result["evaluations"]
    assert len(evaluations) == 3
    for eval in evaluations:
        assert eval["award_pebble"] is False
        assert eval["pebble_color_category"] == "privacidad"
        assert eval["tone"] == "thoughtful"
        assert "Hmm, la próxima vez" in eval["pebble_feedback_text"]

def test_fallback_evaluation_mixed():
    answers = [
        {"userChoice": "bien"},
        {"userChoice": "mal"},
    ]
    result = _fallback_evaluation(answers)
    evaluations = result["evaluations"]
    assert len(evaluations) == 2

    assert evaluations[0]["award_pebble"] is True
    assert evaluations[0]["tone"] == "celebratory"

    assert evaluations[1]["award_pebble"] is False
    assert evaluations[1]["tone"] == "thoughtful"
