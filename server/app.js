// server/app.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./config/db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);

// sincroniza DB una vez por invocación
app.use(async (_req, _res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (err) {
    console.error("Error conexión DB", err);
    _res.status(500).json({ error: "DB error" });
  }
});

export default app;
