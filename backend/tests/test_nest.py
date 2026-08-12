import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.nest.get_collection")
def test_get_nest_empty_state_and_no_div_by_zero(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "invalid_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = False
    mock_users_ref.document.return_value.get.return_value = mock_user_doc
    mock_get_collection.return_value = mock_users_ref

    response = client.get("/api/nest/invalid_user", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json() == {
        "pebbles": [],
        "totalPebbles": 0,
        "nestLevel": "playa",
        "unlockedIslands": [],
        "nextIsland": None,
    }
