import numpy as np
import cv2
from tensorflow.keras.models import load_model

# ✅ LOAD MODEL
model = load_model("custom_cnn_model.h5")

# ✅ LOAD FACE DETECTOR
face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")


def detect_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=3,
        minSize=(30, 30)
    )

    print("Faces detected:", len(faces))

    # ✅ If no face → use full frame
    if len(faces) == 0:
        return frame

    x, y, w, h = faces[0]
    face = frame[y:y+h, x:x+w]

    # ✅ Safety check
    if face is None or face.size == 0:
        return frame

    return face


def preprocess_frame(frame):
    img = cv2.resize(frame, (128, 128))
    img = img / 255.0
    img = np.reshape(img, (1, 128, 128, 3))
    return img


def predict_frame(frame):
    # 🔥 Step 1: detect face or fallback
    face_or_frame = detect_face(frame)

    # 🔥 Step 2: preprocess
    img = preprocess_frame(face_or_frame)

    # 🔥 Step 3: predict
    prediction = model.predict(img, verbose=0)[0][0]

    if prediction > 0.5:
        return "FAKE", float(prediction)
    else:
        return "REAL", float(1 - prediction)


def aggregate_results(results):
    fake_scores = [s for l, s in results if l == "FAKE"]
    real_scores = [s for l, s in results if l == "REAL"]

    if len(fake_scores) > len(real_scores):
        return {
            "result": "FAKE",
            "confidence": sum(fake_scores) / len(results)
        }
    else:
        return {
            "result": "REAL",
            "confidence": sum(real_scores) / len(results)
        }