import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });
import { connectDB } from "./config/db.js";
import cors from "cors";

import portfolioRoutes from "./routes/portfolioRoutes.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1", portfolioRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
