import { User } from "./User.js";
import { Product } from "./Product.js";

// Un usuario tiene muchos productos
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });

// Un producto pertenece a un usuario
Product.belongsTo(User, { foreignKey: "userId" });

export { User, Product };
