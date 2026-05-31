import { useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";

import { useEffect } from "react";



function App() {
  const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [newsText, setNewsText] = useState("");
  const [newsResult, setNewsResult] = useState(null);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    console.log("🔥 SCROLL:", scrollTop);

    setIsScrolled(scrollTop > 20);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  
  

  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];

  if (!selectedFile) return;

  setFile(selectedFile);
  setPreviewUrl(URL.createObjectURL(selectedFile));
  setFileType(selectedFile.type);

  setResult(null);
  };
  
  

    const handleUpload = async () => {
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const formData = new FormData();

  let url = "";


  const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

    if (file.type.startsWith("image")) {
      formData.append("image", file);
      url = `${API_URL}/predict`;
    } else if (file.type.startsWith("video")) {
      formData.append("video", file);
      url = `${API_URL}/predict-video`;
    } else {
      alert("Unsupported file type");
      return;
    }

  try {
    setLoading(true);

    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setResult(response.data);
  } catch (error) {
    console.error(error);
    alert("Upload failed");
  } finally {
    setLoading(false);
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  setDragActive(true);
};

const handleDragLeave = () => {
  setDragActive(false);
};

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setPreviewUrl(URL.createObjectURL(droppedFile));
    setFileType(droppedFile.type);
    setResult(null);
  };

    const handleNewsCheck = async () => {
    if (!newsText.trim()) return;

    setLoadingNews(true);
    setNewsResult(null);

    try {
      const response = await fetch(`${API_URL}/predict-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newsText,
        }),
      });

      const data = await response.json();
      setNewsResult(data);

    } catch (error) {
      console.error("Fake news detection error:", error);
    }

    setLoadingNews(false);
 };


return (
  <>
    {/* NAVBAR */}
    <div className={`navbar ${isScrolled ? "navbar-active" : ""}`}>
      <div className="nav-left">
        <img src={logo} alt="logo" className="nav-logo" />
        <span className={`nav-text ${isScrolled ? "show-text" : ""}`}>
          SachAI
        </span>
      </div>

      <div className="nav-right">
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Login</button>
      </div>
    </div>

    {/* MAIN PAGE */}
    <div className="main-container fade-in">
      <h1 className={`title ${isScrolled ? "title-shrink" : ""}`}>
        SachAI
      </h1>

      <p className="tagline">
        Uncover the truth — because not everything you see is real.
      </p>

      
<div className="dashboard-grid">

  {/* LEFT — DEEPFAKE DETECTION */}
  <div
    className={`upload-card media-card ${
      dragActive ? "drag-active" : ""
    }`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <h2>🎭 Deepfake Detection</h2>

    <p className="helper-text">Supports images and videos</p>

    <img
      src="https://cdn-icons-png.flaticon.com/512/18592/18592682.png"
      alt="icon"
      className="icon"
    />

    {previewUrl && (
      <>
        {fileType.startsWith("image") ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="preview-image"
          />
        ) : (
          <video
            src={previewUrl}
            controls
            className="preview-video"
          />
        )}
      </>
    )}

    <label className="file-upload">
      Choose File
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        hidden
      />
    </label>

    {file && <p className="file-name">{file.name}</p>}

    <button onClick={handleUpload}>Analyze Media</button>

    {loading && <div className="spinner"></div>}

    {result && (
      <div className="result-box fade-in-result">
        <h3
          style={{
            color: result.prediction
              .toLowerCase()
              .includes("fake")
              ? "red"
              : "green",
            fontWeight: "bold",
          }}
        >
          {result.prediction.toUpperCase()}
        </h3>

        <p>
          Confidence: {(result.confidence * 100).toFixed(2)}%
        </p>

        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{
              width: `${result.confidence * 100}%`,
              background: result.prediction
                .toLowerCase()
                .includes("fake")
                ? "red"
                : "green",
            }}
          ></div>
        </div>

        {result.frames_analyzed && (
          <p>Frames analyzed: {result.frames_analyzed}</p>
        )}
      </div>
    )}
  </div>

  {/* CENTER — TEXT ONLY (NOT A CARD) */}
  <div className="center-info">
    <h2>
      AI-Powered Truth Verification <br />
      Across Media & Information
    </h2>

    <p>
      SachAI combines deepfake detection for images/videos with
      intelligent fake news verification to detect manipulation,
      misinformation, and deceptive narratives through one
      unified security platform.
    </p>
  </div>

  {/* RIGHT — FAKE NEWS DETECTION */}
  <div className="upload-card news-card">
    <h2>📰 Fake News Detection</h2>

    <textarea
      placeholder="Paste or type news article here..."
      value={newsText}
      onChange={(e) => setNewsText(e.target.value)}
      rows={8}
    />

    <button onClick={handleNewsCheck}>Analyze News</button>

    {loadingNews && <div className="spinner"></div>}

    {newsResult && (
      <div className="result-box fade-in-result">


<h3
  style={{
    color:
      newsResult.final_verdict.toLowerCase().includes("fake")
        ? "#dc2626" // Red
        : newsResult.final_verdict.toLowerCase().includes("misleading")
        ? "#d97706" // Amber
        : newsResult.final_verdict.toLowerCase().includes("suspicious")
        ? "#7c3aed" // Purple
        : newsResult.final_verdict.toLowerCase().includes("needs context")
        ? "#2563eb" // Blue
        : "#059669", // Green
  }}
>
  {newsResult.final_verdict}
</h3>


<p>
  Confidence: {newsResult.model_confidence}% (
  {newsResult.confidence_label})
</p>

<div className="confidence-bar news-confidence-bar">
  <div
    className="confidence-fill news-confidence-fill"
    style={{
      width: `${newsResult.model_confidence}%`,
      background:
        newsResult.final_verdict.toLowerCase().includes("fake")
          ? "linear-gradient(90deg, #ef4444, #dc2626)"
          : newsResult.final_verdict.toLowerCase().includes("misleading")
          ? "linear-gradient(90deg, #f59e0b, #d97706)"
          : newsResult.final_verdict.toLowerCase().includes("suspicious")
          ? "linear-gradient(90deg, #8b5cf6, #7c3aed)"
          : "linear-gradient(90deg, #10b981, #059669)",
    }}
  ></div>
</div>


        <p>
          Fact Check Rating: {newsResult.fact_check_rating}
        </p>

        <p>{newsResult.ai_explanation}</p>

        {newsResult.source_url && (
          <a
            href={newsResult.source_url}
            target="_blank"
            rel="noreferrer"
          >
            {newsResult.source_label}
          </a>
        )}
      </div>
    )}
  </div>

</div>

      </div>

    <footer className="footer">

      <div className="footer-brand">
        <h3>SachAI</h3>
        <p>
          A next-generation misinformation detection platform designed
          to analyze digital authenticity across visual and textual
          content using AI.
        </p>
      </div>
            
      <div className="footer-links">
        <h4>Platform</h4>
        <p>Deepfake Detection</p>
        <p>Fake News Analysis</p>
        <p>AI Verification</p>
        <p>Security & Trust</p>
      </div>
            
      <div className="footer-contact">
        <h4>Built By</h4>
        <p>Umer Rehman</p>
        <p>With</p>
        <p>Curiosity</p>
      </div>
            
      <div className="footer-bottom">
        © 2026 SachAI — Detect Deepfakes. Verify News. Protect Truth.
      </div>
            
    </footer>
  </>
);
}

export default App;

