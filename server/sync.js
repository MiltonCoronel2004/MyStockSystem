// server/sync.js
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" }); // fuerza la carga del .env correcto

import { sequelize } from "./config/db.js";
import "./models/associations.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente");
    await sequelize.sync({ alter: true });
    console.log("✅ Tablas sincronizadas correctamente");
  } catch (err) {
    console.error("❌ Error al sincronizar:", err);
  } finally {
    process.exit();
  }
})();
