const BASE_URL = "http://127.0.0.1:5000";

export const api = {
  async uploadDocument(file, assignmentId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);

    const res = await fetch(`${BASE_URL}/upload-document`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload document");
    return await res.json(); 
  },

  async listDocuments() {
    const res = await fetch(`${BASE_URL}/list-documents`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return await res.json(); 
  },

  async downloadDocument(id) {
    const res = await fetch(`${BASE_URL}/download-document?id=${id}`);
    if (!res.ok) throw new Error("Failed to download document");
    return await res.blob(); 
  },

  async deleteDocument(id) {
    const res = await fetch(`${BASE_URL}/delete-document?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return await res.json();
  },
};
