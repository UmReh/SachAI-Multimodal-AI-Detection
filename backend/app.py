from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from video_utils import extract_frames
from predict_utils import predict_frame, aggregate_results
from fake_news_model import predict_fake_news
from ai_explainer import generate_ai_explanation
from source_verifier import verify_claim_with_google

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Load your custom trained CNN model
model = load_model("custom_cnn_model.h5")


def predict_text_internal(text):
    try:
        model_result = predict_fake_news(text)

        # Safety check
        if not model_result or "prediction" not in model_result or "confidence" not in model_result:
            return jsonify({
                "error": "Fake news model failed",
                "details": model_result
            }), 500

        fact_check = verify_claim_with_google(text)

        ai_result = generate_ai_explanation(
            model_result["prediction"],
            model_result["confidence"],
            fact_check
        )

        # Safety check
        if not ai_result:
            return jsonify({
                "error": "AI explanation failed"
            }), 500

        source_label = "Read Full Fact Check" if ai_result.get("source_url") else None

        analysis_mode = (
            "Google Fact Check + AI Classifier"
            if fact_check.get("verified")
            else "AI Classifier Only"
        )

        confidence = model_result["confidence"]

        if confidence >= 90:
            confidence_label = "Very High"
        elif confidence >= 75:
            confidence_label = "High"
        elif confidence >= 50:
            confidence_label = "Moderate"
        else:
            confidence_label = "Low"

        return jsonify({
            "model_prediction": model_result["prediction"],
            "model_confidence": model_result["confidence"],
            "confidence_label": confidence_label,

            "fact_check_rating": fact_check.get("rating"),

            "final_verdict": ai_result.get("final_verdict"),
            "verdict_color": ai_result.get("verdict_color"),

            "ai_explanation": ai_result.get("explanation"),

            "source_publisher": ai_result.get("source_publisher"),
            "source_url": ai_result.get("source_url"),
            "source_label": source_label,

            "analysis_mode": analysis_mode
        })

    except Exception as e:
        return jsonify({
            "error": "predict_text_internal failed",
            "details": str(e)
        }), 500

@app.route("/")
def home():
    return "Flask server is running with custom CNN! 🚀"

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # ✅ Preprocess image to match CNN input
    img = cv2.imread(filepath)
    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    img = cv2.resize(img, (128, 128))  # Match training size
    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)

    # ✅ Predict using custom CNN model
    prediction = model.predict(img)[0][0]
    print(f"Raw prediction score: {prediction}")

    label = "real" if prediction >= 0.5 else "deepfake"
    confidence = float(prediction if label == "real" else 1 - prediction)


    result = {
        "filename": file.filename,
        "prediction": label,
        "confidence": round(confidence, 2)
    }
    return jsonify(result)


@app.route("/predict-video", methods=["POST"])
def predict_video():
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    video = request.files["video"]
    video_path = os.path.join("uploads", video.filename)
    video.save(video_path)

    # ✅ Extract frames (now returns arrays, not paths)
    frames = extract_frames(video_path)

    # ✅ Predict
    results = []

    for frame in frames:
        result = predict_frame(frame)
        results.append(result)

    print("Total frames:", len(frames))
    print("Results stored:", len(results))

    if len(results) == 0:
        return jsonify({
            "error": "No faces detected in video"
        }), 400

    # ✅ Aggregate
    final = aggregate_results(results)

    # ✅ Free memory (optional but good practice)
    del frames

    return jsonify({
        "prediction": final["result"],
        "confidence": final["confidence"],
        "frames_analyzed": len(results)
    })

@app.route('/predict-text', methods=['POST'])
def predict_text():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    return predict_text_internal(text)


if __name__ == "__main__":
    app.run(port=5001)

