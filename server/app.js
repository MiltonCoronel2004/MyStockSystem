// server/app.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./config/db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import "./models/associations.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>API MyStockSystem</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        <h1>API MyStockSystem online</h1>
      </body>
    </html>
  `);
});

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
