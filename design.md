## 1. Architecture

The system follows a client–server architecture:

- The **Frontend (React + Vite)** provides the user interface for uploading and managing documents.
- The **Backend (Node.js + Express)** exposes REST APIs for file operations.
- **SQLite Database** stores document metadata.
- **Local File Storage (uploads folder)** stores the physical PDF files.

### Architecture Flow:

User  
→ Frontend (React UI)  
→ Backend (Express REST API)  
→ SQLite Database + Local File System  
→ Response to Frontend  

---

## 2. Stack Choices

| Layer | Technology | Reason |
|--------|------------|--------|
| Frontend | React + Vite | Fast development and modern UI |
| Backend | Node.js + Express | Lightweight and scalable server |
| Database | SQLite | Simple relational database |
| File Upload | Multer | Secure file handling |

---

## 3. Answered Questions

### How are files stored?
Files are stored in the `uploads/` directory on the server.

### How is metadata stored?
SQLite database stores:
- Document ID
- Filename
- File path
- File size
- Assignment ID
- Upload timestamp

### What file types are allowed?
Only **PDF files** are supported.

### How is security handled?
- File type validation
- CORS protection
- Controlled REST API access

---

## 4. API Specification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents/upload` | Upload a PDF |
| GET | `/documents` | List all documents |
| GET | `/documents/:id` | Download a document |
| DELETE | `/documents/:id` | Delete a document |

---

## 5. Assumptions

- Only PDF files will be uploaded.
- Files are stored locally on the server.
- SQLite is sufficient for metadata storage.
- Single-user usage is assumed.
- Authentication is not implemented.
