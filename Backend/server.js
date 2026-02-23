const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Test Route =====
app.get("/", (req, res) => {
  res.send("EduFlow Backend is Running 🚀");
});

// ===== Import Routes =====
app.use("/api/question", require("./routes/questionRoutes"));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const progressRoutes = require("./routes/progressRoutes");
app.use("/api/progress", progressRoutes);