from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
import your_ai_module  # ← ваш существующий модуль

app = FastAPI()

class AnalyzeRequest(BaseModel):
    text: str
    language: str = "ru"
    model: str = "gigachat"  # или gpt, llama и т.д.

@app.post("/analyze")
async def analyze_proverb(request: AnalyzeRequest):
    try:
        result = await your_ai_module.ask(
            prompt=f"Объясни смысл пословицы на {request.language}: '{request.text}'. "
                   "Дай краткое толкование, культурный контекст, пример употребления и похожие пословицы."
        )
        return {
            "summary": result.get("summary"),
            "culturalContext": result.get("context"),
            "usageExample": result.get("example"),
            "relatedProverbs": result.get("related"),
            "modelUsed": request.model
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
