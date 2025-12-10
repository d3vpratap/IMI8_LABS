import { useState } from "react";
import { api } from "../services/api";

export function DocumentUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setMessage({ type: "error", text: "Only PDF files are allowed" });
        setSelectedFile(null);
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setMessage(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await api.uploadDocument(selectedFile);
      setMessage({ type: "success", text: "Document uploaded successfully!" });
      setSelectedFile(null);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      onUploadSuccess();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to upload document",
      });
    } finally {
      setUploading(false);
    }
     setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="upload-container">
      <h2>Upload Medical Document</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {selectedFile ? selectedFile.name : "Choose PDF file..."}
          </label>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="upload-button"
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
    </div>
  );
}
