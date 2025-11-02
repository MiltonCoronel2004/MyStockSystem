import { body } from "express-validator";
import { User } from "../models/User.js";

export const createUserValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("El nombre completo es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .custom(async (email) => {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      console.log(user);

      if (user) throw new Error("El email ya esta registrado");

      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Debe confirmar la contraseña")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Las contraseñas no coinciden");
      return true;
    }),
];

export const loginUserValidator = [
  body("email").trim().notEmpty().withMessage("El email es obligatorio").isEmail().withMessage("Debe proporcionar un email válido"),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
