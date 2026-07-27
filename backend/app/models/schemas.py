from pydantic import BaseModel
from typing import Optional


class FirebaseToken(BaseModel):
    id_token: str


class QuizAnswer(BaseModel):
    questionId: str
    optionSelected: str


class QuizSubmission(BaseModel):
    answers: list[QuizAnswer]


class ScenarioAttempt(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    textStart: Optional[int] = None
    textEnd: Optional[int] = None


class ChecklistAnswer(BaseModel):
    question: str
    userChoice: str


class ChecklistEvaluation(BaseModel):
    scenarioId: str
    answers: list[ChecklistAnswer]
    foundClueIds: list[str]


class UserResponse(BaseModel):
    uid: str
    displayName: str
    nestLevel: str
    totalPebbles: int
    unlockedIslandIds: list[str]


class NestResponse(BaseModel):
    pebbles: list[dict]
    totalPebbles: int
    nestLevel: str
    unlockedIslands: list[dict]
    nextIsland: Optional[dict]
