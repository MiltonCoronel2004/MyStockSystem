import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

// Verificamos si estamos en producción
const isProd = process.env.VERCEL === "1";

// Crea una instancia de conexión a la base de datos usando Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASS, // Contraseña del usuario
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: isProd
      ? { ssl: { require: true, rejectUnauthorized: false } } // En producción: habilita SSL para conexión segura
      : {}, // En desarrollo: sin opciones adicionales
    pool: isProd
      ? { max: 1, min: 0, acquire: 3000, idle: 10000 } // Límite de conexiones simultáneas en producción
      : { max: 5, min: 0, acquire: 30000, idle: 10000 }, // Límite mayor en desarrollo
    logging: false, // Desactiva logs SQL en consola
  }
);
