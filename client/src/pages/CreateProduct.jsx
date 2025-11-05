import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../store/useStore";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const { user } = useStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (loading) return;
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/createproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({
          name: formData.name,
          stock: formData.stock,
          price: formData.price,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setLoading(false);
        data.msg.forEach((msg) => {
          toast.error(msg);
        });
        return;
      }

      toast.success("Producto creado correctamente");
      navigate("/");
      setLoading(false);
    } catch (e) {
      toast.error("Error al crear el producto");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="backdrop-blur-xl bg-slate-800/70 border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-700/50 to-blue-900/30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-cyan-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Volver"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Crear Nuevo Producto
            </h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-cyan-300 mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              placeholder="Ingrese el nombre"
            />
          </div>

          {/* Precio y Stock en grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-cyan-300 mb-2">
                Precio ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-cyan-300 mb-2">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="0"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Crear Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
