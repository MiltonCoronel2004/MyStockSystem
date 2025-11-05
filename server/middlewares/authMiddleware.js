import jwt from "jsonwebtoken";
import { TokenBlacklist } from "../models/TokenBlacklist.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: true, msg: "Token Requerido" });

    const token = auth.split(" ")[1]; // Separa Bearer Token y toma el token

    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    if (blacklisted) return res.status(401).json({ error: true, msg: "Token Invalido" });

    const jwtInfo = jwt.verify(token, process.env.SECRET);
    req.userEmail = jwtInfo.email;

    next();
  } catch {
    res.status(401).json({ error: true, msg: "Token inválido o expirado" });
  }
};
