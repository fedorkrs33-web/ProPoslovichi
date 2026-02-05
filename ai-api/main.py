from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class AnalyzeRequest(BaseModel):
    text: str
    language: str = "ru"

@app.post("/analyze")
async def analyze_proverb(request: AnalyzeRequest):
    # Здесь вызов вашей модели ИИ
    # Пока — заглушка
    return {
        "summary": f"Эта пословица '{request.text}' отражает мудрость народа о труде и терпении.",
        "culturalContext": "Русская культура уделяет большое внимание труду, природе и коллективизму.",
        "usageExample": "Используется, когда кто-то хочет получить результат без усилий.",
        "relatedProverbs": "Терпение и труд всё перетрут, Где хотенье — там и уменье",
        "modelUsed": "gigachat"
    }