// server/api/index.js (para Vercel)
import app from "../app.js";
export default function handler(req, res) {
  return app(req, res);
}
