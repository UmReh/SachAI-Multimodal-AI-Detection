import os
from huggingface_hub import InferenceClient

from dotenv import load_dotenv
import os
from huggingface_hub import InferenceClient

load_dotenv()

client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HF_TOKEN")
)

def predict_fake_news(text):
    try:
        result = client.text_classification(
            text,
            model="hamzab/roberta-fake-news-classification"
        )

        # result example:
        # [{'label': 'LABEL_0', 'score': 0.85}, ...]

        best = max(result, key=lambda x: x["score"])

        label_map = {
            "TRUE": "REAL",
            "FALSE": "FAKE"
            
        }

        return {
            "prediction": label_map.get(best["label"], best["label"]),
            "confidence": round(best["score"]*100, 2)
        }

    except Exception as e:
        return {
            "error": "API failed",
            "details": str(e)
        }