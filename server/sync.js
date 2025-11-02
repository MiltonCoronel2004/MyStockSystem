// Sync with Aiven Mysql DB
import { sequelize } from "./config/db.js";

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
