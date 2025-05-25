const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const datapointRoutes = require("./routes/datapoint");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const datasetRoutes = require("./routes/dataset");

//BNB
const { startCreditListener } = require("../utils/listener");
///

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/datapoint", datapointRoutes);
app.use("/api/dataset", datasetRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Akai Backend Running!");
});

// Function to connect to MongoDB and start the server
async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    console.log("MongoDB connected");

    // Start the server only after successful connection
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // 🔥 Start the BNB listener
      startCreditListener();  //BNB
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process with failure code if connection fails
  }
}

// Start the application
startServer();
