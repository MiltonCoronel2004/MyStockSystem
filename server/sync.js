import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./config/db.js";
import "./models/TokenBlacklist.js";
import "./models/associations.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente");
    await sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas correctamente");
  } catch (err) {
    console.error("Error al sincronizar:", err);
  } finally {
    process.exit();
  }
})();
