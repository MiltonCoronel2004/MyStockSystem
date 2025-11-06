// server/app.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./config/db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import "./models/associations.js"; // Incluye la relación entre modelos

const app = express();

// Permitir peticiones de todos lados (*) o IPs especificas
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
// Contenido json -> objeto
app.use(express.json());

// Para mostrar algo de contenido en la página que genera vercel
app.get("/", (req, res) => {
  res.status(200).json({ message: "API MyStockSystem online" });
});

// Rutas
app.use(userRoutes);
app.use(productRoutes);

// Verificar la conexión en cada petición
app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (err) {
    console.error("Error conexión DB", err);
    res.status(500).json({ error: "DB error" });
  }
});

export default app; // Exportamos app para poder usado en index local e index para vercel.
