const BASE_URL = "http://localhost:5050"; //Use localhost only

export const api = {
  // Upload PDF
  async uploadDocument(file, assignmentId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);

    const res = await fetch(`${BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload document");
    return await res.json();
  },

  //  List all documents
  async listDocuments() {
    const res = await fetch(`${BASE_URL}/documents`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return await res.json();
  },

  // Download by ID (REST правильный путь)
  async downloadDocument(id) {
    const res = await fetch(`${BASE_URL}/documents/${id}`);
    if (!res.ok) throw new Error("Failed to download document");
    return await res.blob();
  },

  // Delete by ID (REST правильный путь)
  async deleteDocument(id) {
    const res = await fetch(`${BASE_URL}/documents/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return await res.json();
  },
};
