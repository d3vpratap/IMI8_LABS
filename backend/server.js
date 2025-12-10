const express = require("express");
const cors = require("cors");
const documentRoutes = require("./routes/documentRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(documentRoutes);

app.listen(5000, "127.0.0.1", () => {
  console.log("Backend running on http://127.0.0.1:5000");
});
