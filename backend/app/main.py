from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, quiz, scenarios, checklist, nest, islands, tutorial
from app.middleware.auth_middleware import FirebaseAuthMiddleware
from app.services.firebase import init_firebase
from app.config import ALLOWED_ORIGINS

app = FastAPI(title="Pebble API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(FirebaseAuthMiddleware)

app.include_router(auth.router)
app.include_router(quiz.router)
app.include_router(scenarios.router)
app.include_router(checklist.router)
app.include_router(nest.router)
app.include_router(islands.router)
app.include_router(tutorial.router)


@app.on_event("startup")
async def startup():
    init_firebase()


@app.get("/")
async def root():
    return {"service": "Pebble API", "status": "ok", "version": "1.0.0"}
