import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import (
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
)
import logging

logger = logging.getLogger(__name__)

db = None
_firebase_initialized = False
_firebase_dev_mode = False


def init_firebase():
    global db, _firebase_initialized, _firebase_dev_mode
    if _firebase_initialized:
        return

    if not FIREBASE_PRIVATE_KEY or FIREBASE_PRIVATE_KEY == "":
        logger.warning("Firebase credentials not configured — running in dev mode with local storage")
        _firebase_dev_mode = True
        return

    try:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": FIREBASE_PROJECT_ID,
            "private_key": FIREBASE_PRIVATE_KEY,
            "client_email": FIREBASE_CLIENT_EMAIL,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        _firebase_initialized = True
        logger.info("Firebase initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        _firebase_dev_mode = True


def verify_token(id_token: str) -> dict | None:
    if _firebase_dev_mode:
        return {"uid": "dev-user", "email": "dev@pebble.app"}
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        return None


def get_collection(name: str):
    if db is None:
        return DevCollection(name)
    return db.collection(name)


_dev_stores: dict[str, dict] = {}

class DevCollection:
    """In-memory fallback when Firebase is not configured."""

    def __init__(self, name: str):
        self.name = name
        if name not in _dev_stores:
            _dev_stores[name] = {}
        self._docs = _dev_stores[name]

    def document(self, doc_id: str):
        return DevDocument(doc_id, self)

    def where(self, field: str, op: str, value):
        return DevQuery(self, field, op, value)

    def stream(self):
        return list(self._docs.values())

    def add(self, data: dict) -> tuple:
        import uuid
        doc_id = str(uuid.uuid4())
        self._docs[doc_id] = {**data, "id": doc_id}
        return doc_id, None


class DevDocument:
    def __init__(self, doc_id: str, collection: DevCollection):
        self.id = doc_id
        self._collection = collection

    def get(self):
        data = self._collection._docs.get(self.id)
        if data is None:
            return None
        return DevSnapshot(self.id, data)

    def set(self, data: dict):
        self._collection._docs[self.id] = {**data, "id": self.id}

    def update(self, data: dict):
        if self.id in self._collection._docs:
            self._collection._docs[self.id].update(data)

    def collection(self, name: str):
        nested_name = f"{self._collection.name}/{self.id}/{name}"
        return DevCollection(nested_name)


class DevSnapshot:
    def __init__(self, id: str, data: dict):
        self.id = id
        self._data = data

    def to_dict(self):
        return self._data

    @property
    def exists(self):
        return True


class DevQuery:
    def __init__(self, collection: DevCollection, field: str, op: str, value):
        self._collection = collection
        self._field = field
        self._op = op
        self._value = value

    def stream(self):
        results = []
        for doc_id, data in self._collection._docs.items():
            val = data.get(self._field)
            if self._op == "==" and val == self._value:
                results.append(DevSnapshot(doc_id, data))
            elif self._op == "in" and val in self._value:
                results.append(DevSnapshot(doc_id, data))
            elif self._op == "not-in" and val not in self._value:
                results.append(DevSnapshot(doc_id, data))
        return results
