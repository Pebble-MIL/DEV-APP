import pytest
from unittest.mock import patch, MagicMock
from app.services.ai_pebble import evaluate_checklist

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
