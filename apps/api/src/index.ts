import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import companyRoutes from "./routes/company.routes";
import reviewRoutes from "./routes/review.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";
import CompanyModel from "./models/company.model";
import ReviewModel from "./models/review.model";

// Load configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/review_and_rating";

// Standard Middlewares
app.use(cors({ origin: "*" })); // Allow all for workspace integration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload assets statically
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOAD_DIR));

// Base Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "healthy", timestamp: new Date() });
});

// API Routes mounting
app.use("/api/companies", companyRoutes);
app.use("/api/reviews", reviewRoutes);

// Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Start Express Server
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully to MongoDB Database.");

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Express Backend Server active on PORT: ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error("Express API initiation failure:", error);
    process.exit(1);
  }
};

startServer();
