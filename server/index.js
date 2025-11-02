// server/index.js (solo para local)
import app from "./app.js";
import { sequelize } from "./config/db.js";
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("Base de datos conectada");
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (e) {
    console.error("Error en la conexión a la base de datos", e);
  }
});
