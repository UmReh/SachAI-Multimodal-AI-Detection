from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Load your custom trained CNN model
model = load_model("custom_cnn_model.h5")

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

if __name__ == "__main__":
    app.run(port=5001)
