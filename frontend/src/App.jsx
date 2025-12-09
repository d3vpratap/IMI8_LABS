import { useState } from "react";
import { DocumentUpload } from "./components/DocumentUpload";
import { DocumentList } from "./components/DocumentList";
import "./App.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Patient Portal - Medical Documents</h1>
        <p>Securely upload, manage, and access your medical documents</p>
      </header>

      <main className="app-main">
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        <DocumentList refreshTrigger={refreshTrigger} />
      </main>

      <footer className="app-footer">
        <p>Patient Portal - Secure Medical Document Management</p>
      </footer>
    </div>
  );
}

export default App;
