import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import QuizSubmission

client = TestClient(app)

@patch("app.routers.quiz.get_collection")
def test_submit_quiz_playa_level(mock_get_collection):
    mock_users_ref = MagicMock()
    mock_get_collection.return_value = mock_users_ref

    # Setup mock chain for Firebase
    mock_user_doc = MagicMock()
    mock_users_ref.document.return_value = mock_user_doc
    mock_quiz_collection = MagicMock()
    mock_user_doc.collection.return_value = mock_quiz_collection
    mock_quiz_doc = MagicMock()
    mock_quiz_collection.document.return_value = mock_quiz_doc

    payload = {
        "answers": [
            {"questionId": "q1", "optionSelected": "C"}, # 1 point
            {"questionId": "q2", "optionSelected": "C"}, # 1 point
            {"questionId": "q3", "optionSelected": "A"}  # 0 points
        ]
    }

    # In auth_middleware.py, /api/quiz/submit is in public_paths, so uid will default to dev-user
    response = client.post("/api/quiz/submit", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["totalScore"] == 2
    assert data["nestLevel"] == "playa"

    # Verify Firebase interactions
    mock_users_ref.document.assert_called_with("dev-user")
    mock_user_doc.update.assert_called_once_with({
        "nestLevel": "playa",
        "totalPebbles": 0,
    })

    mock_user_doc.collection.assert_called_with("quizResults")
    mock_quiz_collection.document.assert_called_with("initial")
    mock_quiz_doc.set.assert_called_once()

    set_args = mock_quiz_doc.set.call_args[0][0]
    assert set_args["totalScore"] == 2
    assert set_args["nestLevelAssigned"] == "playa"

@patch("app.routers.quiz.get_collection")
def test_submit_quiz_acantilado_level(mock_get_collection):
    mock_users_ref = MagicMock()
    mock_get_collection.return_value = mock_users_ref

    # Setup mock chain for Firebase
    mock_user_doc = MagicMock()
    mock_users_ref.document.return_value = mock_user_doc

    payload = {
        "answers": [
            {"questionId": "q1", "optionSelected": "B"}, # 2 points
            {"questionId": "q2", "optionSelected": "B"}, # 2 points
            {"questionId": "q3", "optionSelected": "A"}  # 0 points
        ]
    }

    response = client.post("/api/quiz/submit", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["totalScore"] == 4
    assert data["nestLevel"] == "acantilado"

    mock_user_doc.update.assert_called_once_with({
        "nestLevel": "acantilado",
        "totalPebbles": 0,
    })

@patch("app.routers.quiz.get_collection")
def test_submit_quiz_glaciar_level(mock_get_collection):
    mock_users_ref = MagicMock()
    mock_get_collection.return_value = mock_users_ref

    # Setup mock chain for Firebase
    mock_user_doc = MagicMock()
    mock_users_ref.document.return_value = mock_user_doc

    payload = {
        "answers": [
            {"questionId": "q1", "optionSelected": "B"}, # 2 points
            {"questionId": "q2", "optionSelected": "B"}, # 2 points
            {"questionId": "q3", "optionSelected": "B"}  # 2 points
        ]
    }

    response = client.post("/api/quiz/submit", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["totalScore"] == 6
    assert data["nestLevel"] == "glaciar"

    mock_user_doc.update.assert_called_once_with({
        "nestLevel": "glaciar",
        "totalPebbles": 0,
    })

@patch("app.routers.quiz.get_collection")
def test_submit_quiz_invalid_questions(mock_get_collection):
    mock_users_ref = MagicMock()
    mock_get_collection.return_value = mock_users_ref

    payload = {
        "answers": [
            {"questionId": "q_invalid", "optionSelected": "A"}, # 0 points, invalid question
            {"questionId": "q1", "optionSelected": "D"}  # 0 points, invalid option
        ]
    }

    response = client.post("/api/quiz/submit", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["totalScore"] == 0
    assert data["nestLevel"] == "playa"
