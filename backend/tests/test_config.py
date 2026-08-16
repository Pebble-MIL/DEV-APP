import os
import pytest
import importlib
from unittest import mock

def test_production_missing_keys_raises_value_error():
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "production",
        "FIREBASE_PRIVATE_KEY": "",
        "FIREBASE_CLIENT_EMAIL": "",
        "OPENROUTER_API_KEY": ""
    }):
        with pytest.raises(ValueError) as exc_info:
            import app.config
            importlib.reload(app.config)

        assert "Missing critical environment variables in production" in str(exc_info.value)
        assert "FIREBASE_PRIVATE_KEY" in str(exc_info.value)
        assert "FIREBASE_CLIENT_EMAIL" in str(exc_info.value)
        assert "OPENROUTER_API_KEY" in str(exc_info.value)

def test_production_missing_some_keys_raises_value_error():
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "production",
        "FIREBASE_PRIVATE_KEY": "some-key",
        "FIREBASE_CLIENT_EMAIL": "",
        "OPENROUTER_API_KEY": "some-api-key"
    }):
        with pytest.raises(ValueError) as exc_info:
            import app.config
            importlib.reload(app.config)

        assert "Missing critical environment variables in production" in str(exc_info.value)
        assert "FIREBASE_PRIVATE_KEY" not in str(exc_info.value)
        assert "FIREBASE_CLIENT_EMAIL" in str(exc_info.value)
        assert "OPENROUTER_API_KEY" not in str(exc_info.value)

def test_production_all_keys_present_no_error():
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "production",
        "FIREBASE_PRIVATE_KEY": "some-key",
        "FIREBASE_CLIENT_EMAIL": "some-email@example.com",
        "OPENROUTER_API_KEY": "some-api-key"
    }):
        # Should not raise an error
        import app.config
        importlib.reload(app.config)

        assert app.config.ENVIRONMENT == "production"

def test_development_missing_keys_no_error():
    with mock.patch.dict(os.environ, {
        "ENVIRONMENT": "development",
        "FIREBASE_PRIVATE_KEY": "",
        "FIREBASE_CLIENT_EMAIL": "",
        "OPENROUTER_API_KEY": ""
    }):
        # Should not raise an error
        import app.config
        importlib.reload(app.config)

        assert app.config.ENVIRONMENT == "development"
