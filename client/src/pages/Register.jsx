import { useState } from "react";

import { Link } from "react-router";
import { toast } from "react-toastify";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const Legend = () => {
  return (
    <p className="text-sm text-slate-300 font-medium">
      Ya tiene cuenta?{" "}
      <Link
        to="/"
        className="font-semibold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-linear-to-r after:from-cyan-400 after:to-blue-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
      >
        Iniciar Sesión
      </Link>
    </p>
  );
};

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (loading) return;
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
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

      toast.success(data.msg);
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Form title="Crear Cuenta" Legend={Legend} onSubmit={handleSubmit}>
      <Input
        name="Fullname"
        type="text"
        id="fullname"
        title="Nombre completo"
        placeholder="John Doe"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input name="email" type="email" title="Correo" placeholder="johndoe@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input
        type="password"
        name="Password"
        title="Contraseña"
        placeholder="*************"
        value={password}
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        title="Confirmar Contraseña"
        placeholder="*************"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit" value={loading ? null : "Registrarse"} disabled={loading} />
    </Form>
  );
}
