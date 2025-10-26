import express from "express";
import "dotenv/config";
import cors from "cors";
import { sequelize } from "./config/db.js";
import "./config/db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";

const PORT = process.argv[2] ?? 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("Bases de datos conectada");
    console.log(`servidor corriendo en http://localhost:${PORT}`);
  } catch (e) {
    console.log("Hubo un error en la conexion a la base de datos");
    console.log(e);
  }
});
