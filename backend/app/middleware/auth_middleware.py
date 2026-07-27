from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app import services


class FirebaseAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_paths = {
            "/api/tutorial/scenario",
            "/api/auth/verify",
            "/api/quiz/submit",
            "/docs",
            "/openapi.json",
        }
        if request.url.path in public_paths or not request.url.path.startswith("/api/"):
            return await call_next(request)

        if services.firebase._firebase_dev_mode:
            request.state.user = {"uid": "dev-user"}
            request.state.uid = "dev-user"
            return await call_next(request)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing Authorization header")

        id_token = auth_header.replace("Bearer ", "")
        user = services.firebase.verify_token(id_token)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid Firebase token")

        request.state.user = user
        request.state.uid = user.get("uid")
        return await call_next(request)
