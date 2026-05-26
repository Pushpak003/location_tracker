import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tracking", trackingRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running",
  });
});

export default app;