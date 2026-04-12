# 🧠 Deepfake Detection System using Custom CNN

## 📌 Overview

Deepfakes—AI-generated synthetic media—pose a serious threat to digital authenticity, misinformation control, and cybersecurity. This project presents a **deep learning–based system** capable of detecting manipulated images using a **custom Convolutional Neural Network (CNN)**.

The system is implemented as a **full-stack web application**, allowing users to upload an image and receive real-time predictions indicating whether it is **Real or Deepfake**, along with a confidence score.

---

## 🎯 Problem Statement

With the rapid advancement of AI, deepfake content has become highly realistic and difficult to detect manually. This creates serious risks in:

* Journalism & media credibility
* Political misinformation
* Identity fraud & cybercrime

This project aims to provide an **automated, scalable, and accurate solution** to detect such manipulated media.

---

## 🎯 Objectives

* Develop a **custom CNN model** for deepfake image detection
* Train the model on a **large real vs fake dataset (~200,000 images)**
* Build a **full-stack application** for real-time prediction
* Provide **visual insights (training graphs, metrics)**

---

## 🏗️ System Architecture

```
Frontend (React)
        ↓
Node.js Server (Middleware)
        ↓
Flask API (Python)
        ↓
Custom CNN Model (.h5)
```

---

## ⚙️ Tech Stack

### Frontend

* React.js
* Pico CSS

### Backend

* Node.js (API handling)
* Flask (ML inference)

### Machine Learning

* TensorFlow / Keras
* Custom CNN Model

### Dataset

* Kaggle: Deepfake and Real Images (~200K images)

---

## ✨ Features

* 📤 Upload image for analysis
* ⚡ Real-time prediction (within ~2–3 seconds)
* 🎯 Output: Real / Deepfake + Confidence Score
* 📊 Training visualization (accuracy & loss graphs)
* 🧠 Custom CNN model (not API-based)
* 🌐 Full-stack integration

---

### 🔹 Home Page
<p align="center">
  <img src="./screenshots/home.png" width="700"/>
</p>


### 🔹 Prediction Result
<p align="center">
  <img src="./screenshots/result.png" width="700"/>
</p>

---

## 🚀 How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/UmReh/deepfake-detector.git
cd deepfake-detector
```

---

### 2️⃣ Start Backend (Node + Flask)

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Open in browser

```
http://localhost:5173/
```

---

## 📊 Model Performance

* Accuracy: **~84%**
* Dataset size: **~200,000 images**
* Prediction latency: **2–3 seconds**

---

## ⚠️ Limitations

* Supports **only image-based detection**
* Performance depends on dataset diversity
* No explainability (XAI) implemented
* Not optimized for large-scale concurrent users

---

## 🔮 Future Scope

* 🎥 Video deepfake detection
* 🔊 Audio deepfake detection
* 📈 Explainable AI (Grad-CAM, LIME)
* ☁️ Cloud deployment (AWS/GCP)
* 📱 Mobile app integration

---

## 📂 Dataset Notice

The dataset is not included due to size constraints.

Download from:
👉 https://www.kaggle.com/datasets/manjilkarki/deepfake-and-real-images

Place it inside:

```
backend/Dataset/
```

---

## 🧠 Key Achievements

* Built a **custom CNN from scratch**
* Developed a **full-stack AI application**
* Achieved **real-time prediction pipeline**
* Integrated ML model into production workflow

---

## 📚 References

* TensorFlow & Keras Docs
* Flask & Node.js Docs
* React Documentation
* Kaggle Dataset

---

## 👨‍💻 Author

**Umer Rehman**
B.Tech Computer Science

---
