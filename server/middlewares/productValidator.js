import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El precio debe ser un número válido con hasta 2 decimales")
    .custom((value) => {
      const num = parseFloat(value);
      if (num < 0) throw new Error("El precio no puede ser negativo");
      if (num === 0) throw new Error("El precio debe ser mayor que 0");
      if (num > 99999999) throw new Error("El precio no puede exceder los 8 dígitos");
      return true;
    }),

  body("stock").notEmpty().withMessage("El stock es obligatorio").isInt({ min: 0 }).withMessage("El stock debe ser un número entero no negativo"),
];

export const updateProductValidator = [
  body("name").optional().trim().isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("price")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El precio debe ser un número válido con hasta 2 decimales")
    .custom((value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return true;
      if (num < 0) throw new Error("El precio no puede ser negativo");
      if (num === 0) throw new Error("El precio debe ser mayor que 0");
      if (num > 99999999) throw new Error("El precio no puede exceder los 8 dígitos");
      return true;
    }),

  body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser un número entero no negativo"),
];
