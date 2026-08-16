import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios.get_collection")
def test_get_next_scenario_playa(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = True
    mock_user_doc.to_dict.return_value = {"nestLevel": "playa"}
    mock_users_ref.document.return_value.get.return_value = mock_user_doc

    # Mock pebbles collection to be empty (no completed scenarios)
    mock_pebbles_ref = MagicMock()
    mock_pebbles_ref.stream.return_value = []
    mock_users_ref.document.return_value.collection.return_value = mock_pebbles_ref

    mock_get_collection.return_value = mock_users_ref

    response = client.get("/api/scenarios/next", headers={"Authorization": "Bearer token"})

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["id"].startswith("playa_")

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.scenarios.get_collection")
def test_get_next_scenario_no_more_scenarios(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "test_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = True
    mock_user_doc.to_dict.return_value = {"nestLevel": "playa"}
    mock_users_ref.document.return_value.get.return_value = mock_user_doc

    # Mock pebbles collection to have completed ALL playa scenarios
    mock_pebble_1 = MagicMock()
    mock_pebble_1.exists = True
    mock_pebble_1.to_dict.return_value = {"scenarioId": "playa_01"}

    mock_pebble_2 = MagicMock()
    mock_pebble_2.exists = True
    mock_pebble_2.to_dict.return_value = {"scenarioId": "playa_02"}

    mock_pebble_3 = MagicMock()
    mock_pebble_3.exists = True
    mock_pebble_3.to_dict.return_value = {"scenarioId": "playa_03"}

    mock_pebble_4 = MagicMock()
    mock_pebble_4.exists = True
    mock_pebble_4.to_dict.return_value = {"scenarioId": "playa_04"}

    mock_pebble_5 = MagicMock()
    mock_pebble_5.exists = True
    mock_pebble_5.to_dict.return_value = {"scenarioId": "playa_05"}

    mock_pebbles_ref = MagicMock()
    mock_pebbles_ref.stream.return_value = [mock_pebble_1, mock_pebble_2, mock_pebble_3, mock_pebble_4, mock_pebble_5]
    mock_users_ref.document.return_value.collection.return_value = mock_pebbles_ref

    mock_get_collection.return_value = mock_users_ref

    response = client.get("/api/scenarios/next", headers={"Authorization": "Bearer token"})

    assert response.status_code == 200
    assert response.json() == {"message": "No more scenarios. Check back later!", "done": True}
