import { User } from "./User.js";
import { Product } from "./Product.js";

// Un usuario tiene muchos productos
User.hasMany(Product, { foreignKey: "user_id", onDelete: "CASCADE" });

// Un producto pertenece a un usuario
Product.belongsTo(User, { foreignKey: "user_id" });

export { User, Product };
