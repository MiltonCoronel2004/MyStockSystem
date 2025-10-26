import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export class TokenBlacklist extends Model {}

TokenBlacklist.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "token_blacklist",
    modelName: "TokenBlacklist",
    timestamps: true,
    underscored: true,
  }
);
