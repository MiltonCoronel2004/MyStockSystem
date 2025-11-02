import { Outlet, useNavigate, NavLink } from "react-router";
import { useStore } from "../../store/useStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Package, Plus, LogOut } from "lucide-react";

export default function Private() {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user.token) return navigate("/login");
  }, [user, navigate]);

  if (!user.token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-sm"></div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_API_URL}/logout`;
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      });

      const res = await req.json();
      console.log(res);

      if (res.error) {
        toast.error(res.msg || "Error al cerrar sesión");
        setLoading(false);
        return;
      }

      setUser({
        full_name: null,
        email: null,
        token: null,
      });

      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } catch {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <nav className="backdrop-blur-xl bg-slate-800/60 border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(34,211,238,0.3)]">
              MyStockSystem
            </h1>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isActive ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300"
                  }`
                }
              >
                <Package size={18} />
                Productos
              </NavLink>

              <NavLink
                to="/createproduct"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isActive ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300"
                  }`
                }
              >
                <Plus size={18} />
                Crear Producto
              </NavLink>

              {/* Divider */}
              <div className="w-px h-8 bg-slate-700/50 mx-2"></div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
                {loading ? "Cerrando..." : "Salir"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
