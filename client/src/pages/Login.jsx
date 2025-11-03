import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { toast } from "react-toastify";
import { useStore } from "../store/useStore";

const Legend = () => (
  <p className="text-sm text-slate-300 font-medium">
    No tiene cuenta?{" "}
    <Link
      to="/register"
      className="font-semibold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-linear-to-r after:from-cyan-400 after:to-blue-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
    >
      Crear Cuenta
    </Link>
  </p>
);

export default function Login() {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (loading) return;
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.error) {
        setLoading(false);
        if (Array.isArray(data.msg)) {
          data.msg.forEach((msg) => {
            toast.error(msg);
          });
        } else {
          toast.error(data.msg);
        }
        return;
      }

      // Guardar usuario en Zustand
      setUser(data.user);

      toast.success("Sesión iniciada");
      navigate("/");
    } catch (err) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form title="Iniciar Sesión" Legend={Legend} onSubmit={handleSubmit}>
      <Input type="email" id="email" name="email" title="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input
        type="password"
        id="password"
        name="password"
        title="Contraseña"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" value={loading ? null : "Iniciar Sesión"} disabled={loading} />
    </Form>
  );
}
