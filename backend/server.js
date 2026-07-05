const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Simple Request Logger Middleware to display all incoming API calls in terminal console
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] 🌐 ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/about",    require("./routes/about.routes"));
app.use("/api/blog",     require("./routes/blog.routes"));
app.use("/api/careers",  require("./routes/careers.routes"));
app.use("/api/contact",  require("./routes/contact.routes"));
app.use("/api/services", require("./routes/services.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/reviews",  require("./routes/review.routes"));
app.use("/api",          require("./routes/compat.routes"));

app.get("/", (req, res) => res.json({ message: "API is running 🚀" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => { console.error("❌ MongoDB connection failed:", err.message); process.exit(1); });
