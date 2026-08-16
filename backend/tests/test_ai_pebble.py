from app.services.ai_pebble import _fallback_evaluation

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
