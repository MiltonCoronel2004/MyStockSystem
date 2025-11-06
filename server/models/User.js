import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

// Se define la clase User que hereda de Model, para crear un modelo ORM de Sequelize
export class User extends Model {}

// Inicializa el modelo con sus campos y opciones de configuración
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Coloque un email válido",
        },
      },
    },
    hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize, // instancia de conexión a la base de datos usada por este modelo
    tableName: "users", // nombre real de la tabla
    modelName: "User", // nombre lógico del modelo dentro de Sequelize
    timestamps: true, // agrega automáticamente created_at y updated_at
    paranoid: true, // activa soft delete (usa deleted_at en lugar de borrar filas)
    underscored: true, // usa snake_case en lugar de camelCase en los campos
    indexes: [{ unique: true, fields: ["email"] }], // índice único en el campo email
  }
);
