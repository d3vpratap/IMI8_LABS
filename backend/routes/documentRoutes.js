const express = require("express");
const { upload } = require("../middleware/upload");
const db = require("../db");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const router = express.Router();

/* Route-level CORS (kept as-is but now works correctly) */
router.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// UPLOAD DOCUMENT → POST /documents/upload
router.post("/documents/upload", upload.single("file"), (req, res) => {
  try {
    const { assignmentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const doc = {
      id: randomUUID(),
      filename: req.file.originalname,
      filepath: req.file.path,
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

// LIST DOCUMENTS → GET /documents
router.get("/documents", (req, res) => {
  try {
    const rows = db
      .prepare(
        `
      SELECT id, filename, filepath, filesize, assignment_id, created_at 
      FROM documents 
      ORDER BY created_at DESC
    `
      )
      .all();

    // Explicitly set status + JSON content
    res.status(200).json({
      documents: rows,
    });
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// DOWNLOAD DOCUMENT BY ID → GET /documents/:id
router.get("/documents/:id", (req, res) => {
  const { id } = req.params;

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

// DELETE DOCUMENT BY ID → DELETE /documents/:id
router.delete("/documents/:id", (req, res) => {
  const { id } = req.params;

  try {
    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
  
    // Delete file if exists
    if (doc.filepath && fs.existsSync(doc.filepath)) {
      fs.unlinkSync(doc.filepath);
    }

    // Remove DB record
    db.prepare("DELETE FROM documents WHERE id = ?").run(id);

    res.json({ message: "Document deleted successfully", id });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;
