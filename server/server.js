import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";

import cors from "cors";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
