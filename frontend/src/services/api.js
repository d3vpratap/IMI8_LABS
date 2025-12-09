const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const api = {
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/upload-document`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload document");
    }

    const data = await response.json();
    return data.document;
  },

  async listDocuments() {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/list-documents`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch documents");
    }

    const data = await response.json();
    return data.documents;
  },

  async downloadDocument(id) {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/download-document?id=${id}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to download document");
    }

    return await response.blob();
  },

  async deleteDocument(id) {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/delete-document?id=${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete document");
    }
  },
};
