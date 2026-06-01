import { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5001";

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`✅ Uploaded: ${res.data.filePath}`);
    } catch (err) {
      setMessage("❌ Upload failed. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Deepfake Detector</h1>
      <input type="file" onChange={handleFileChange} style={styles.input} />
      {preview && <img src={preview} alt="Preview" style={styles.image} />}
      <button onClick={handleUpload} style={styles.button}>Upload</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    background: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    marginBottom: "10px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    marginTop: "10px",
    borderRadius: "8px",
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#0066ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};

export default Upload;
