import { useState, useEffect } from "react";
import { api } from "../services/api";

export function DocumentList({ refreshTrigger }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await api.listDocuments();
      setDocuments(data.documents);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to fetch documents",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const handleDownload = async (doc) => {
    try {
      const blob = await api.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = doc.filename;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);

      setMessage({
        type: "success",
        text: "Document downloaded successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to download document",
      });
    }
     setTimeout(() => setMessage(null), 3000);
  };

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this document?")) {
    return;
  }

  try {
    await api.deleteDocument(id);
    setMessage({
      type: "success",
      text: "Document deleted successfully!",
    });
    fetchDocuments();
  } catch (error) {
    setMessage({
      type: "error",
      text: error.message || "Failed to delete document",
    });
  }
   setTimeout(() => setMessage(null), 3000);
};


const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return "N/A";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};


const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};


  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  return (
    <div className="document-list-container">
      <h2>My Medical Documents</h2>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {documents.length === 0 ? (
        <p className="no-documents">No documents uploaded yet.</p>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-info">
                <h3 className="document-name">{doc.filename}</h3>
                <p className="document-meta">
                  Size: {formatFileSize(doc.filesize)}
                </p>
                <p className="document-meta">
                  Uploaded: {formatDate(doc.created_at)}
                </p>
              </div>

              <div className="document-actions">
                <button
                  onClick={() => handleDownload(doc)}
                  className="download-button"
                >
                  Download
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
