from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Dummy data for testing
DUMMY_SCENARIOS = [
    {
        "id": "scenario_1",
        "hiddenClues": [
            {
                "clueId": "clue_1",
                "category": "phishing",
                "explanation": "This is a phishing link.",
                "coordinates": {"x": 100, "y": 200, "radius": 30}
            },
            {
                "clueId": "clue_2",
                "category": "suspicious_sender",
                "explanation": "Suspicious sender address.",
                "textSpan": {"start": 10, "end": 20}
            }
        ]
    },
    {
        "id": "scenario_2",
        "hiddenClues": [
            {
                "clueId": "clue_3",
                "category": "urgent_language",
                "explanation": "Urgent language.",
                # No radius, defaults to 30
                "coordinates": {"x": 50, "y": 50}
            }
        ]
    }
]

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios._load_scenarios")
def test_attempt_scenario_not_found(mock_load_scenarios, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}
    mock_load_scenarios.return_value = DUMMY_SCENARIOS

    response = client.post(
        "/api/scenarios/invalid_scenario/attempt",
        headers={"Authorization": "Bearer token"},
        json={"x": 100, "y": 200}
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Scenario not found"}

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios._load_scenarios")
def test_attempt_scenario_coordinate_match(mock_load_scenarios, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}
    mock_load_scenarios.return_value = DUMMY_SCENARIOS

    # Exact match
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"x": 100, "y": 200}
    )

    assert response.status_code == 200
    assert response.json()["found"] is True
    assert response.json()["clueId"] == "clue_1"

    # Distance within radius (dx=15, dy=20, distance=25 <= 30)
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"x": 115, "y": 220}
    )
    assert response.status_code == 200
    assert response.json()["found"] is True

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios._load_scenarios")
def test_attempt_scenario_coordinate_no_match(mock_load_scenarios, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}
    mock_load_scenarios.return_value = DUMMY_SCENARIOS

    # Distance outside radius (dx=20, dy=25, distance=32.015 > 30)
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"x": 120, "y": 225}
    )

    assert response.status_code == 200
    assert response.json()["found"] is False
    assert response.json()["clueId"] is None

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios._load_scenarios")
def test_attempt_scenario_text_span_match(mock_load_scenarios, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}
    mock_load_scenarios.return_value = DUMMY_SCENARIOS

    # Start and end within span
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"textStart": 12, "textEnd": 18}
    )

    assert response.status_code == 200
    assert response.json()["found"] is True
    assert response.json()["clueId"] == "clue_2"

    # Exact span match
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"textStart": 10, "textEnd": 20}
    )
    assert response.status_code == 200
    assert response.json()["found"] is True

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios._load_scenarios")
def test_attempt_scenario_text_span_no_match(mock_load_scenarios, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}
    mock_load_scenarios.return_value = DUMMY_SCENARIOS

    # Span starts too early
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"textStart": 5, "textEnd": 15}
    )
    assert response.status_code == 200
    assert response.json()["found"] is False

    # Span ends too late
    response = client.post(
        "/api/scenarios/scenario_1/attempt",
        headers={"Authorization": "Bearer token"},
        json={"textStart": 15, "textEnd": 25}
    )
    assert response.status_code == 200
    assert response.json()["found"] is False

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios._load_scenarios")
def test_attempt_scenario_default_radius(mock_load_scenarios, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}
    mock_load_scenarios.return_value = DUMMY_SCENARIOS

    # Distance within default radius (30) (dx=20, dy=15, distance=25)
    response = client.post(
        "/api/scenarios/scenario_2/attempt",
        headers={"Authorization": "Bearer token"},
        json={"x": 70, "y": 65}
    )
    assert response.status_code == 200
    assert response.json()["found"] is True

    # Distance outside default radius (30) (dx=25, dy=20, distance=32.01)
    response = client.post(
        "/api/scenarios/scenario_2/attempt",
        headers={"Authorization": "Bearer token"},
        json={"x": 75, "y": 70}
    )
    assert response.status_code == 200
    assert response.json()["found"] is False
