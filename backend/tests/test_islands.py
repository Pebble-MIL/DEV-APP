import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.seed_data import ISLANDS

client = TestClient(app)

@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.islands.get_collection")
def test_unlock_check_user_not_found(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "invalid_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = False
    mock_users_ref.document.return_value.get.return_value = mock_user_doc
    mock_get_collection.return_value = mock_users_ref

    response = client.post("/api/islands/unlock-check", headers={"Authorization": "Bearer token"})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}


@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.islands.get_collection")
def test_unlock_check_no_new_unlocks(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "valid_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = True
    mock_user_doc.to_dict.return_value = {
        "totalPebbles": 2,
        "unlockedIslandIds": ["isla_bahia_calma"]
    }
    mock_users_ref.document.return_value.get.return_value = mock_user_doc
    mock_get_collection.return_value = mock_users_ref

    response = client.post("/api/islands/unlock-check", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    data = response.json()
    assert data["newUnlocks"] == []
    # Only the first island should be in unlocked
    assert set(data["unlockedIslandIds"]) == {"isla_bahia_calma"}
    mock_users_ref.document().update.assert_not_called()


@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.islands.get_collection")
def test_unlock_check_single_unlock(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "valid_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = True
    mock_user_doc.to_dict.return_value = {
        "totalPebbles": 3,
        "unlockedIslandIds": ["isla_bahia_calma"]
    }
    mock_users_ref.document.return_value.get.return_value = mock_user_doc
    mock_get_collection.return_value = mock_users_ref

    response = client.post("/api/islands/unlock-check", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    data = response.json()

    assert len(data["newUnlocks"]) == 1
    assert data["newUnlocks"][0]["id"] == "isla_bosque_dorado"
    assert set(data["unlockedIslandIds"]) == {"isla_bahia_calma", "isla_bosque_dorado"}

    mock_users_ref.document.assert_called_with("valid_user")
    mock_users_ref.document().update.assert_called_once()


@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.islands.get_collection")
def test_unlock_check_multiple_unlocks(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "valid_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = True
    # Start with 0 pebbles, then artificially set to 15 to trigger all unlocks.
    # Actually wait, required is 0 for bahia, 3 for bosque, 6 for cima, 10 for laguna, 15 for glaciar
    mock_user_doc.to_dict.return_value = {
        "totalPebbles": 15,
        "unlockedIslandIds": []
    }
    mock_users_ref.document.return_value.get.return_value = mock_user_doc
    mock_get_collection.return_value = mock_users_ref

    response = client.post("/api/islands/unlock-check", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    data = response.json()

    assert len(data["newUnlocks"]) == 5
    unlocked_ids = set(data["unlockedIslandIds"])
    assert unlocked_ids == {island["id"] for island in ISLANDS[:5]}

    mock_users_ref.document.assert_called_with("valid_user")
    mock_users_ref.document().update.assert_called_once()


@patch("app.middleware.auth_middleware.services.firebase.verify_token")
@patch("app.routers.islands.get_collection")
def test_unlock_check_already_unlocked(mock_get_collection, mock_verify_token):
    mock_verify_token.return_value = {"uid": "valid_user"}

    mock_users_ref = MagicMock()
    mock_user_doc = MagicMock()
    mock_user_doc.exists = True
    # User has all pebbles and all islands already unlocked
    mock_user_doc.to_dict.return_value = {
        "totalPebbles": 15,
        "unlockedIslandIds": [island["id"] for island in ISLANDS]
    }
    mock_users_ref.document.return_value.get.return_value = mock_user_doc
    mock_get_collection.return_value = mock_users_ref

    response = client.post("/api/islands/unlock-check", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    data = response.json()

    assert data["newUnlocks"] == []
    unlocked_ids = set(data["unlockedIslandIds"])
    assert unlocked_ids == {island["id"] for island in ISLANDS}

    mock_users_ref.document().update.assert_not_called()
