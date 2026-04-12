console.log("Starting server...");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads")); // Serve static files from uploads folder

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload + Predict Route
app.post("/upload", upload.single("image"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    // Prepare form-data to send to Flask
    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath)); // ✅ Matches Flask


    const flaskResponse = await axios.post("http://localhost:5001/predict", formData, {
      headers: formData.getHeaders(),
    });

    // Send combined response back to frontend
    res.json({
      message: "File uploaded and analyzed successfully",
      filePath,
      prediction: flaskResponse.data.prediction || flaskResponse.data.result,
      confidence: flaskResponse.data.confidence || null,
    });
  } catch (error) {
    console.error("Prediction error:", error.message);
    res.status(500).json({ message: "Prediction failed", error: error.message });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
