import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/msg.routes.js";
import appointmentRouter from "./routes/appoinment.routes.js";
import prescriptionRouter from "./routes/prescription.routes.js";
import path from "path";
dotenv.config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(
  cors({
    // origin: process.env.CLINET_ORIGIN,
    origin: "http://localhost:5173",  
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// Add CORS configuration for static files
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//db connection
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then(() =>
    console.log(`connected to MongoDB on: ${mongoose.connection.host}`)
  )
  .catch((err) => {
    console.log("Error connecting to MongoDB!!\n", err);
    process.exit(1);
  });

//routes
app.get("/", (req, res) =>
  res.json({ message: "Welcome to the root of the server" })
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/appoinments", appointmentRouter);
app.use("/api/v1/prescriptions", prescriptionRouter);

//error-middleware
app.use(errorMiddleware);

//server
app.listen(PORT, () =>
  console.log(`server is running on: http://localhost:${PORT}`)
);
