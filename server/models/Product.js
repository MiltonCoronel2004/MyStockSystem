import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre del producto es obligatorio" },
        len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres" },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "El precio debe ser un número decimal válido" },
        min: { args: [0], msg: "El precio no puede ser negativo" },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "El stock debe ser un número entero" },
        min: { args: [0], msg: "El stock no puede ser negativo" },
      },
    },
  },
  {
    sequelize,
    tableName: "products",
    modelName: "Product",
    timestamps: true,
    underscored: true,
  }
);
