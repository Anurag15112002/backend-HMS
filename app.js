import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import userRouter from './router/userRouter.js';
import appointmentRouter from "./router/appointmentRouter.js";

// Load environment variables
config({ path: ".env" });

const app = express();

// Middleware to log request and response headers for debugging
app.use((req, res, next) => {
  console.log("Request Headers:", req.headers);
  res.on("finish", () => {
    console.log("Response Headers:", res.getHeaders());
  });
  next();
});

// CORS configuration

const allowedOrigins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      // If origin is not provided (like when testing locally), allow it
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(`CORS: Allowing request from ${origin}`); // For debugging purposes
        callback(null, true);
      } else {
        console.error(`CORS: Blocked request from ${origin}`); // For debugging purposes
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and credentials
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Route handlers
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Database connection
dbConnection();

// Error middleware
app.use(errorMiddleware);

export default app;
