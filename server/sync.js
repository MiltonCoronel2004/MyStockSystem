// sync.js
// === Sincronización con base de datos Aiven MySQL ===

import { sequelize } from "./config/db.js";

// Importar todos los modelos definidos
import "./models/User.js";
import "./models/Product.js";
import "./models/TokenBlacklist.js";


(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente");
    await sequelize.sync({ alter: true }); // crea o actualiza tablas según los modelos
    console.log("✅ Tablas sincronizadas correctamente");
  } catch (err) {
    console.error("❌ Error al sincronizar:", err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();
