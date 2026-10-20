import threading

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

MODEL_ID = "hamzab/roberta-fake-news-classification"
MAX_TOKENS = 512

# Runs fully locally (free, offline after the first download).
# Weights are cached by huggingface in ~/.cache/huggingface after first use.
_lock = threading.Lock()
_tokenizer = None
_model = None
_label_map = None


def _load():
    global _tokenizer, _model, _label_map
    if _model is not None:
        return
    with _lock:
        if _model is not None:
            return
        tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID).eval()
        # config.id2label is {0: 'FAKE', 1: 'TRUE'}
        _label_map = {
            int(i): "FAKE" if str(name).upper() == "FAKE" else "REAL"
            for i, name in model.config.id2label.items()
        }
        _tokenizer, _model = tokenizer, model


def warm_up():
    """Load the model ahead of the first request (call from a background thread)."""
    try:
        _load()
    except Exception as e:
        print(f"Fake-news model warm-up failed: {e}")


def predict_fake_news(text):
    try:
        _load()
        inputs = _tokenizer(
            text, return_tensors="pt", truncation=True, max_length=MAX_TOKENS
        )
        with torch.no_grad():
            probs = torch.softmax(_model(**inputs).logits, dim=-1)[0]

        best = int(torch.argmax(probs))
        return {
            "prediction": _label_map[best],
            "confidence": round(float(probs[best]) * 100, 2),
        }

    except Exception as e:
        return {
            "error": "Local model failed",
            "details": str(e),
        }
