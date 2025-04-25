const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:8080", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

// Database connection
mongoose
  .connect("mongodb://localhost:27017/movie-recommendation", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
