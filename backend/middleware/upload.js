const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { assignmentId } = req.body || {};

    // fallback if assignmentId missing
    const folderName = assignmentId
      ? `assignment_${assignmentId}`
      : "assignment_unknown";

    const uploadPath = path.join("uploads", folderName);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = { upload };
