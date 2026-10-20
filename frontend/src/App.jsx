import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";
import DemoFace from "./components/DemoFace";

const API_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001"
).replace(/\/+$/, "");
const MAX_CHARS = 2000;

/* ——— Icons ———————————————————————————————————————————————— */

const Icon = {
  upload: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  image: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 18l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  news: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9h8M8 13h8M8 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  text: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  link: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5M12 16.5v.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  sun: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  moon: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ——— Helpers ——————————————————————————————————————————————— */

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* Turns anything the backend (or network) throws at us into a short, safe message. */
function friendlyError(err, kind) {
  if (axios.isAxiosError?.(err) || err?.name === "TypeError") {
    if (!err.response) {
      return "Can't reach the analysis server. Make sure the backend is running and try again.";
    }
  }
  const serverMsg = err?.response?.data?.error || err?.serverMessage;
  if (kind === "news" && serverMsg) {
    return "The claim checker is temporarily unavailable. Please try again in a little while.";
  }
  if (serverMsg) return serverMsg;
  return "Something went wrong while analyzing. Please try again.";
}

/* ——— Cold-start handling ——————————————————————————————————— */
/* The free backend sleeps when idle and takes ~1–2 minutes to wake up. While it
   boots, requests fail in ways that look like network errors or gateway pages. */

const WAKE_TIMEOUT_MS = 3 * 60 * 1000; // give up after 3 minutes
const WAKE_RETRY_MS = 7000;
const SLOW_HINT_MS = 12000; // a request hanging this long probably means it's asleep

function wakeError(message) {
  const e = new Error(message);
  e.isWaking = true;
  return e;
}

function looksAsleep(err) {
  if (err?.isWaking) return true;
  if (axios.isAxiosError?.(err)) {
    if (!err.response) return true; // network / CORS failure while the host serves its own page
    const s = err.response.status;
    if (s === 502 || s === 503 || s === 504) return true;
    return typeof err.response.data === "string" && /<html/i.test(err.response.data);
  }
  return err?.name === "TypeError"; // fetch() network failure
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ——— Sub-components ———————————————————————————————————————— */

function WakingNotice({ seconds, onCancel }) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return (
    <div className="waking" role="status" aria-live="polite">
      <div className="waking-head">
        <span className="waking-pulse" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h4>Waking up the analysis server</h4>
      </div>
      <p>
        Our free server naps when it's idle. It's starting up now, and your check will
        run automatically as soon as it's ready. This usually takes 1–2 minutes.
      </p>
      <div className="waking-bar" aria-hidden="true">
        <span />
      </div>
      <div className="waking-foot">
        <span className="tabular-nums">
          Elapsed {m}:{s}
        </span>
        <button className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function MediaInput({
  file,
  previewUrl,
  fileType,
  dragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemove,
  onAnalyze,
}) {
  const inputRef = useRef(null);

  if (file && previewUrl) {
    return (
      <div className="media-selected">
        <div className="media-selected-row">
          {fileType.startsWith("image") ? (
            <img src={previewUrl} alt="Selected media" className="media-selected-thumb" />
          ) : (
            <video src={previewUrl} muted className="media-selected-thumb" />
          )}
          <div className="media-selected-meta">
            <span className="media-selected-name">{file.name}</span>
            <span className="media-selected-size">
              {fileType.startsWith("image") ? "Image" : "Video"} · {formatBytes(file.size)}
            </span>
          </div>
          <button className="btn-ghost" onClick={onRemove}>
            Remove
          </button>
        </div>
        <button className="btn-primary btn-block" onClick={onAnalyze}>
          Analyze media {Icon.arrow}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`drop-zone ${dragActive ? "drop-zone--active" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <span className="drop-zone-icon">{Icon.upload}</span>
      <span className="drop-zone-title">Drop an image or video here</span>
      <span className="drop-zone-text">
        or <span className="drop-zone-browse">browse your files</span>
      </span>
      <span className="drop-zone-formats">JPG · PNG · MP4 — up to 50MB</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={onFileChange}
        hidden
      />
    </div>
  );
}

function NewsInput({ newsText, onNewsChange, onCheck }) {
  const canCheck = newsText.trim().length > 0;
  return (
    <div className="news-input">
      <div className="news-textarea-wrap">
        <textarea
          className="news-textarea"
          placeholder="Paste a headline, claim or article excerpt to check against verified sources…"
          value={newsText}
          onChange={onNewsChange}
          maxLength={MAX_CHARS}
          rows={6}
        />
        <span className="char-count">
          {newsText.length} / {MAX_CHARS}
        </span>
      </div>
      <button className="btn-primary btn-block" onClick={onCheck} disabled={!canCheck}>
        Check claim {Icon.arrow}
      </button>
    </div>
  );
}

function ErrorNotice({ message, onDismiss }) {
  return (
    <div className="error-notice" role="alert">
      <span className="error-notice-icon">{Icon.alert}</span>
      <p>{message}</p>
      <button className="error-notice-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

function VerdictResult({ result, onCheckAnother }) {
  const verdictText = String(result.verdict || "Inconclusive");
  const tone = result.flagged ? "bad" : "good";
  const pct = Math.max(0, Math.min(100, Number(result.confidence) || 0));

  return (
    <div className={`verdict verdict--${tone}`}>
      <div className="verdict-head">
        <span className="verdict-badge">
          {result.flagged ? Icon.alert : Icon.check}
          {verdictText}
        </span>
        <span className="verdict-kind">
          {result.tab === "media" ? "Media analysis" : "Claim analysis"}
        </span>
      </div>

      <div className="verdict-grid">
        <div className="verdict-preview">
          {result.tab === "media" ? (
            result.fileType?.startsWith("image") ? (
              <img src={result.previewUrl} alt="Analyzed content" className="verdict-media" />
            ) : (
              <video src={result.previewUrl} controls className="verdict-media" />
            )
          ) : (
            <blockquote className="verdict-quote">{result.newsText}</blockquote>
          )}
        </div>

        <div className="verdict-side">
          <div className="verdict-confidence-label">Confidence</div>
          <div className="verdict-confidence tabular-nums">{pct}%</div>
          <div className="meter" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
            <div className="meter-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="verdict-confidence-note">{result.confidenceLabel}</div>
        </div>
      </div>

      {result.explanation && (
        <div className="verdict-explanation">
          <h4>Why this verdict</h4>
          <p>{result.explanation}</p>
          {result.sourceUrl && (
            <a
              href={result.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="verdict-factcheck-link"
            >
              {result.sourceName || "Read the full fact-check"} {Icon.arrow}
            </a>
          )}
        </div>
      )}

      <button className="btn-secondary" onClick={onCheckAnother}>
        Check something else
      </button>
    </div>
  );
}

/* ——— App ———————————————————————————————————————————————————— */

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState("");
  const preview = new URLSearchParams(window.location.search).get("preview");
  const [loading, setLoading] = useState(preview === "waking");
  const [waking, setWaking] = useState(preview === "waking");
  const [wakeSeconds, setWakeSeconds] = useState(0);
  const cancelRef = useRef(false);
  const [dragActive, setDragActive] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(preview === "waking" ? "news" : "media");
  const [newsText, setNewsText] = useState(
    preview === "waking" ? "Scientists confirm the Moon is made of cheese." : ""
  );
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("sachai-theme", theme);
    } catch {
      /* storage unavailable — theme just won't persist */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setScanDone(true);
      return;
    }
    const timer = setTimeout(() => setScanDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Free blob URLs when they're replaced / on unmount.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Quietly nudge a sleeping backend awake as soon as the page loads, so it is
  // usually ready by the time someone submits something.
  useEffect(() => {
    fetch(`${API_URL}/`, { mode: "no-cors", cache: "no-store" }).catch(() => {});
  }, []);

  // Elapsed-time counter for the "waking up" notice.
  useEffect(() => {
    if (!waking) {
      setWakeSeconds(0);
      return undefined;
    }
    const started = Date.now();
    const id = setInterval(() => setWakeSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [waking]);

  /* Runs `attempt`; if the server looks asleep, shows the waking notice and keeps
     retrying until it answers, the user cancels, or the timeout passes. */
  const withWakeRetry = async (attempt, { slowHint = true } = {}) => {
    cancelRef.current = false;
    const started = Date.now();
    for (;;) {
      const slowTimer = slowHint ? setTimeout(() => setWaking(true), SLOW_HINT_MS) : null;
      try {
        const out = await attempt();
        clearTimeout(slowTimer);
        setWaking(false);
        return out;
      } catch (err) {
        clearTimeout(slowTimer);
        if (cancelRef.current) throw Object.assign(new Error("cancelled"), { cancelled: true });
        if (!looksAsleep(err) || Date.now() - started > WAKE_TIMEOUT_MS) {
          setWaking(false);
          throw err;
        }
        setWaking(true);
        await sleep(WAKE_RETRY_MS);
        if (cancelRef.current) throw Object.assign(new Error("cancelled"), { cancelled: true });
      }
    }
  };

  const cancelWake = () => {
    cancelRef.current = true;
    setWaking(false);
    setLoading(false);
  };

  const selectFile = (selected) => {
    if (!selected) return;
    if (!/^(image|video)\//.test(selected.type)) {
      setError("Unsupported file type. Please choose an image or a video.");
      return;
    }
    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setFileType(selected.type);
    setResult(null);
  };

  const handleFileChange = (e) => selectFile(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    selectFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    let url;
    if (file.type.startsWith("image")) {
      formData.append("image", file);
      url = `${API_URL}/predict`;
    } else {
      formData.append("video", file);
      url = `${API_URL}/predict-video`;
    }

    setError("");
    setLoading(true);
    try {
      const isVideo = file.type.startsWith("video");
      const { data } = await withWakeRetry(
        () =>
          axios.post(url, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        { slowHint: !isVideo }
      );

      const flagged = String(data.prediction || "").toLowerCase().includes("fake") ||
        String(data.prediction || "").toLowerCase().includes("deepfake");
      const frames = data.frames_analyzed;
      const confidence = ((Number(data.confidence) || 0) * 100).toFixed(1);

      setResult({
        tab: "media",
        verdict: flagged ? "Likely fake" : "Likely authentic",
        flagged,
        confidence,
        confidenceLabel: "Based on visual analysis by our detection model",
        explanation: frames
          ? flagged
            ? `Signs of manipulation were detected across ${frames} analyzed frames.`
            : `No facial inconsistencies were detected across ${frames} analyzed frames.`
          : flagged
            ? "Visual inconsistencies suggest this content has been manipulated."
            : "No signs of manipulation were detected in this content.",
        previewUrl,
        fileType,
      });
    } catch (err) {
      if (err?.cancelled) return;
      console.error(err);
      setError(friendlyError(err, "media"));
    } finally {
      setLoading(false);
    }
  };

  const handleNewsCheck = async () => {
    const text = newsText.trim();
    if (!text) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await withWakeRetry(async () => {
        const response = await fetch(`${API_URL}/predict-text`, {
          method: "POST",
          // text/plain keeps this a "simple" CORS request (no preflight); the
          // backend parses the body as JSON regardless of content type.
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify({ text }),
        });

        if ([502, 503, 504].includes(response.status)) throw wakeError("Server is starting");

        let body;
        try {
          body = await response.json();
        } catch {
          // A non-JSON reply means a host page (sleeping/starting), not our API.
          throw wakeError("Server is starting");
        }

        if (!response.ok || !body.final_verdict) {
          const err = new Error("Claim check failed");
          err.serverMessage = body.error || "bad response";
          throw err;
        }
        return body;
      });

      const fv = String(data.final_verdict).toLowerCase();
      const flagged =
        fv.includes("fake") || fv.includes("misleading") || fv.includes("suspicious") || fv.includes("false");

      setResult({
        tab: "news",
        verdict: data.final_verdict,
        flagged,
        confidence: Number(data.model_confidence) || 0,
        confidenceLabel: "Based on our classifier and fact-check cross-reference",
        explanation: data.ai_explanation,
        sourceName: data.source_label,
        sourceUrl: data.source_url,
        newsText: text,
      });
    } catch (err) {
      if (err?.cancelled) return;
      console.error("Fake news detection error:", err);
      setError(friendlyError(err, "news"));
    } finally {
      setLoading(false);
    }
  };

  const scrollToTool = () => {
    setMenuOpen(false);
    document.getElementById("tool-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const switchTab = (tab) => {
    cancelRef.current = true;
    setActiveTab(tab);
    setResult(null);
    setError("");
    setWaking(false);
    setLoading(false);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileType("");
    setResult(null);
  };

  const resetAll = () => {
    cancelRef.current = true;
    setWaking(false);
    setResult(null);
    setError("");
    setFile(null);
    setPreviewUrl(null);
    setFileType("");
    setNewsText("");
    setLoading(false);
  };

  return (
    <>
      {/* NAVBAR — sticky floating pill */}
      <header className={`navbar ${isScrolled ? "navbar-active" : ""}`}>
        <a href="#top" className="nav-wordmark" aria-label="SachAI home">
          <img src={logo} alt="" className="nav-logo" />
          <span className="nav-wordmark-text">SachAI</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`} aria-label="Primary">
          <a href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#faq" className="nav-link" onClick={() => setMenuOpen(false)}>FAQ</a>
          <button className="nav-cta" onClick={scrollToTool}>Try it free</button>
        </nav>

        <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Light theme" : "Dark theme"}
        >
          {theme === "dark" ? Icon.sun : Icon.moon}
        </button>
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
        </div>
      </header>

      <div className="main-container" id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true" />
          <div className="sachai-container hero-inner">
            <div className="hero-text">
              <span className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                AI-powered media &amp; claim verification
              </span>
              <h1>
                Not everything
                <br />
                you see is <em>real.</em>
              </h1>
              <p>
                SachAI inspects images, videos and news claims for signs of
                manipulation — and shows you exactly why it reached its verdict.
              </p>
              <div className="hero-actions">
                <button className="hero-cta" onClick={scrollToTool}>
                  Check something now {Icon.arrow}
                </button>
                <a href="#how-it-works" className="hero-secondary">See how it works</a>
              </div>
              <ul className="hero-points">
                <li>{Icon.check} Images &amp; video</li>
                <li>{Icon.check} Fact-checked claims</li>
                <li>{Icon.check} Explained results</li>
              </ul>
            </div>

            <div className="hero-demo">
              <div className="hero-demo-frame">
                <DemoFace scanned={scanDone} />
                <div className="hero-scan-band" />
                <div className="hero-scanner-corners">
                  <div className="scanner-corner scanner-corner--tl" />
                  <div className="scanner-corner scanner-corner--tr" />
                  <div className="scanner-corner scanner-corner--bl" />
                  <div className="scanner-corner scanner-corner--br" />
                </div>
                <div className={`hero-verdict ${scanDone ? "hero-verdict--visible" : ""}`}>
                  <span className="hero-verdict-stamp">{Icon.check} 94% authentic</span>
                </div>
              </div>
              <p className="hero-caption">Example scan — try your own below.</p>
            </div>
          </div>
        </section>

        {/* TOOL WORKSPACE */}
        <section className="tool-workspace-section" id="tool-workspace">
          <div className="tool-workspace">
            <div className="tool-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "media"}
                className={`tool-tab ${activeTab === "media" ? "tool-tab--active" : ""}`}
                onClick={() => switchTab("media")}
              >
                {Icon.image} Media
              </button>
              <button
                role="tab"
                aria-selected={activeTab === "news"}
                className={`tool-tab ${activeTab === "news" ? "tool-tab--active" : ""}`}
                onClick={() => switchTab("news")}
              >
                {Icon.news} News claim
              </button>
            </div>

            <div className="tool-panel">
              {error && <ErrorNotice message={error} onDismiss={() => setError("")} />}

              {loading ? (
                <div className="tool-loading">
                  <div className="tool-loading-preview">
                    {activeTab === "media" && previewUrl ? (
                      fileType.startsWith("image") ? (
                        <img src={previewUrl} alt="Analyzing" />
                      ) : (
                        <video src={previewUrl} muted />
                      )
                    ) : (
                      <div className="tool-loading-text">{newsText}</div>
                    )}
                    <div className="tool-loading-scan" />
                  </div>
                  {waking ? (
                    <WakingNotice seconds={wakeSeconds} onCancel={cancelWake} />
                  ) : (
                    <p className="tool-loading-label">Analyzing — this can take a few seconds…</p>
                  )}
                </div>
              ) : result ? (
                <VerdictResult result={result} onCheckAnother={resetAll} />
              ) : activeTab === "media" ? (
                <MediaInput
                  file={file}
                  previewUrl={previewUrl}
                  fileType={fileType}
                  dragActive={dragActive}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileChange={handleFileChange}
                  onRemove={removeFile}
                  onAnalyze={handleUpload}
                />
              ) : (
                <NewsInput
                  newsText={newsText}
                  onNewsChange={(e) => setNewsText(e.target.value)}
                  onCheck={handleNewsCheck}
                />
              )}
            </div>

            <p className="tool-disclaimer">
              Results are probabilistic and meant to support — not replace — your own judgment.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="features">
          <div className="sachai-container">
            <div className="section-head">
              <span className="section-kicker">What SachAI does</span>
              <h2>One place to verify what you see and read</h2>
              <p>
                Purpose-built detection for synthetic media and misleading claims,
                with results you can actually understand.
              </p>
            </div>
            <div className="feature-grid">
              <article className="feature-card">
                <span className="feature-icon">{Icon.image}</span>
                <h3>Deepfake image detection</h3>
                <p>A trained CNN looks for facial artefacts and inconsistencies that the human eye tends to miss.</p>
              </article>
              <article className="feature-card">
                <span className="feature-icon">{Icon.shield}</span>
                <h3>Video frame analysis</h3>
                <p>Faces are sampled across the clip and scored frame by frame, then aggregated into one verdict.</p>
              </article>
              <article className="feature-card">
                <span className="feature-icon">{Icon.text}</span>
                <h3>News claim classifier</h3>
                <p>Paste a headline or paragraph and get a model-based credibility assessment in seconds.</p>
              </article>
              <article className="feature-card">
                <span className="feature-icon">{Icon.link}</span>
                <h3>Fact-check cross-reference</h3>
                <p>Claims are matched against published fact-checks, with a link to the original source when available.</p>
              </article>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-it-works" id="how-it-works">
          <div className="sachai-container">
            <div className="section-head">
              <span className="section-kicker">How it works</span>
              <h2>From upload to verdict in three steps</h2>
            </div>
            <ol className="how-steps">
              <li className="how-step">
                <span className="how-step-num">1</span>
                <h3 className="how-step-title">Submit</h3>
                <p className="how-step-desc">Upload an image or video, or paste the claim you want to check.</p>
              </li>
              <li className="how-step">
                <span className="how-step-num">2</span>
                <h3 className="how-step-title">We analyze</h3>
                <p className="how-step-desc">
                  Our models inspect visual or textual patterns and, for claims, cross-reference fact-check sources.
                </p>
              </li>
              <li className="how-step">
                <span className="how-step-num">3</span>
                <h3 className="how-step-title">Get a verdict</h3>
                <p className="how-step-desc">
                  See a clear result with a confidence score and a plain-language explanation.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq" id="faq">
          <div className="sachai-container faq-inner">
            <div className="section-head section-head--left">
              <span className="section-kicker">FAQ</span>
              <h2>Good questions</h2>
            </div>
            <div className="faq-list">
              <details className="faq-item">
                <summary>How accurate is the detection?</summary>
                <p>
                  No detector is perfect. SachAI gives a confidence score with every result so you can judge how
                  much weight to give it. Treat it as strong evidence, not proof.
                </p>
              </details>
              <details className="faq-item">
                <summary>Are my uploads stored?</summary>
                <p>
                  Files are sent to the analysis server only to produce a result. Don't upload anything you
                  aren't comfortable sharing.
                </p>
              </details>
              <details className="faq-item">
                <summary>What file types are supported?</summary>
                <p>Common image formats (JPG, PNG) and video formats (MP4), up to 50MB.</p>
              </details>
              <details className="faq-item">
                <summary>Why does a video need a visible face?</summary>
                <p>
                  The video detector scores faces frame by frame. If no face is found, there's nothing to
                  analyze and you'll see an error.
                </p>
              </details>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="sachai-container footer-top">
          <div className="footer-left">
            <span className="footer-brand">
              <img src={logo} alt="" className="footer-logo" />
              <span className="footer-wordmark">SachAI</span>
            </span>
            <p className="footer-tagline">Built to check what's real. Made by Umer Rehman.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#features" className="footer-link">Features</a>
            <a href="#how-it-works" className="footer-link">How it works</a>
            <a href="#faq" className="footer-link">FAQ</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <div className="sachai-container footer-bottom-inner">
            <span>© 2026 SachAI. All rights reserved.</span>
            <span>Results are informational and not a legal determination.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
