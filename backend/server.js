const express = require("express");
const cors = require("cors");
const documentRoutes = require("./routes/documentRoutes");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(documentRoutes);

app.listen(5050, () => {
  console.log("Backend running on http://localhost:5050");
});
