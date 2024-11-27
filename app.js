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

app.use(
  cors({
    origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
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
