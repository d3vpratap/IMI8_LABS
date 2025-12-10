const express = require("express");
const { upload } = require("../middleware/upload");
const db = require("../db");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Upload document
router.post("/upload-document", upload.single("file"), (req, res) => {
  try {
    const { assignmentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const doc = {
      id: randomUUID(),
      filename: req.file.originalname,
      filepath: req.file.path, // e.g. uploads/assignment_1/123-file.pdf
      filesize: req.file.size,
      assignment_id: assignmentId || null,
      created_at: new Date().toISOString(),
    };

    db.prepare(
      `
      INSERT INTO documents 
        (id, filename, filepath, filesize, assignment_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    ).run(
      doc.id,
      doc.filename,
      doc.filepath,
      doc.filesize,
      doc.assignment_id,
      doc.created_at
    );

    res.status(201).json({ document: doc });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

// List documents
router.get("/list-documents", (req, res) => {
  try {
    const rows = db
      .prepare(
        "SELECT id, filename, filepath, filesize, assignment_id, created_at FROM documents ORDER BY created_at DESC"
      )
      .all();

    res.json({ documents: rows });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Download document by id
router.get("/download-document", (req, res) => {
  const { id } = req.query;

  try {
    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.resolve(doc.filepath);
    return res.download(filePath, doc.filename);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download document" });
  }
});

// Delete document by id (file + DB)
router.delete("/delete-document", (req, res) => {
  const { id } = req.query;

  try {
    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete file if exists
    if (doc.filepath && fs.existsSync(doc.filepath)) {
      fs.unlinkSync(doc.filepath);
    }

    // Remove row
    db.prepare("DELETE FROM documents WHERE id = ?").run(id);

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;
