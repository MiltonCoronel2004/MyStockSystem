import { validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      msg: errors.array().map((e) => e.msg),
    });
  }
  next();
};
