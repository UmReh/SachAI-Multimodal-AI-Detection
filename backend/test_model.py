import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Load model
model = load_model("custom_cnn_model.h5")

# Load and preprocess image
img = cv2.imread("./uploads/realhaifrfr.jpg")  # 🔁 Use your test image path here
if img is None:
    print("Error: Image not found or unable to read.")
    exit()

img = cv2.resize(img, (128, 128))
img = img.astype(np.float32) / 255.0
img = np.expand_dims(img, axis=0)

# Predict
prediction = model.predict(img)[0][0]
print(f"Raw prediction score: {prediction}")

# ✅ Correct label logic (real = 1, fake = 0)
label = "real" if prediction >= 0.5 else "deepfake"
confidence = prediction if label == "real" else 1 - prediction

print(f"Prediction: {label.upper()} ({confidence * 100:.2f}% confident)")
