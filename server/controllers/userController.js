import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TokenBlacklist } from "../models/TokenBlacklist.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length < 1) return res.status(404).json({ error: true, msg: "No se encontraron usuarios" });
    res.json({ error: false, users });
  } catch (err) {
    res.status(500).json({ error: true, msg: err.message });
  }
};

export const createUser = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      res.status(403).json({ error: true, msg: "Las contraseñas no coinciden" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      hash,
      activateToken,
    });

    res.json({ error: false, msg: "Usuario creado", user });
  } catch (err) {
    res.status(400).json({ error: true, msg: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: true, msg: "Credenciales Incorrectas" });
    const checkPasswd = await bcrypt.compare(password, user.hash);
    if (!checkPasswd) return res.status(403).json({ error: true, msg: "Credenciales Incorrectas" });

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "1h" });

    res.json({
      error: false,
      user: {
        full_name: user.fullName,
        email: user.email,
        token: `Bearer ${token}`,
      },
    });
  } catch (err) {
    res.status(500).json({ error: true, msg: "Hubo un error al iniciar sesión" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: true, msg: "Token requerido" });

    const token = auth.split(" ")[1];

    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    await TokenBlacklist.create({ token, expiresAt });

    res.json({ error: false, msg: "Sesión cerrada e invalidada" });
  } catch (err) {
    res.status(500).json({ error: true, msg: err });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: true, msg: "Token Requerido" });

    const token = auth.split(" ")[1];

    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    if (blacklisted) return res.status(401).json({ error: true, msg: "Token Invalido" });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: true, msg: "Token inválido o expirado" });
      res.json({ error: false, msg: "Token Válido", data: decoded });
    });
  } catch (e) {
    res.status(400).json({ error: true, msg: e });
  }
};
