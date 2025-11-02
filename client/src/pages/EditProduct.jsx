import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_API_URL;
let token = null;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const getProduct = async () => {
    try {
      const res = await fetch(`${url}/getproduct/${id}`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.error) {
        setLoading(false);
        toast.error(error.msg);
        return;
      }

      setFormData({ name: data.product.name, price: data.product.price, stock: data.product.stock });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    token = JSON.parse(localStorage.getItem("token"))?.state?.user?.token;

    getProduct();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="relative w-16 h-16">
  //       <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
  //       <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
  //       <div className="absolute inset-2 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-600/20 blur-sm"></div>
  //     </div>
  //   );
  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (loadingSubmit) return;
      setLoadingSubmit(true);

      const res = await fetch(`${url}/updateproduct/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ name: formData.name, price: formData.price, stock: formData.stock }),
      });

      const data = await res.json();

      if (data.error) {
        setLoadingSubmit(false);
        data.msg.forEach((msg) => {
          toast.error(msg);
        });
        return;
      }

      setLoadingSubmit(false);
      toast.success("Producto actualizado correctamente");
      navigate("/");
    } catch (error) {
      toast.error("Error al actualizar el producto");
    } finally {
      setLoadingSubmit(false);
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
              Editar Producto
              {/* #{id} */}
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
              disabled={loadingSubmit}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loadingSubmit ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
