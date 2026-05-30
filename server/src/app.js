import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DevMate AI API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

export default app;