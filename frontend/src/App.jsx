import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile));
    setMessage(""); // clear previous result
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // ✅ matches backend (not "file")

    try {
      const response = await axios.post("http://localhost:5001/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { prediction, confidence } = response.data;
      setMessage(`✅ Prediction: ${prediction.toUpperCase()} (${confidence * 100}% confident)`);
    } catch (error) {
      console.error("❌ Upload or prediction error:", error);
      setMessage("❌ Upload failed. Try again.");
    }
  };

  return (
    <div className="page">
      <header className="navbar">
        <div className="navbar-title">Deepfake Detector</div>
        <div className="navbar-links">
          <button>Home</button>
          <button>Login</button>
        </div>
      </header>

      <div className="content">
        <div className="left-panel">
          <div className="upload-box">
            <img
              src="https://cdn-icons-png.flaticon.com/512/18592/18592682.png"
              alt="icon"
              className="icon"
            />

            {/* Image Preview */}
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="preview-image" />
            )}

            {/* 👇 File Input */}
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {/* 👇 Upload Button */}
            <button onClick={handleUpload}>Upload</button>

            {/* 👇 Prediction Message */}
            {message && <p className="message">{message}</p>}
          </div>
        </div>

        <div className="right-panel">
          <h2>AI-powered Deepfake Detection</h2>
          <p>
            Upload any image to verify authenticity using our smart detection
            engine.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
