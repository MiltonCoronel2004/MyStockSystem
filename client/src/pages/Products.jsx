import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const url = import.meta.env.VITE_API_URL;
let token = null;
export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getAllProducts = async () => {
    try {
      if (!token) {
        navigate("/");
      }
      setLoading(true);
      const res = await fetch(`${url}/getproducts`, {
        method: "GET",
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.error) {
        setLoading(false);
        toast.error(data.msg || "Error, se ha cerrado la sesión");
        return;
      }
      setLoading(false);
      setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    token = JSON.parse(localStorage.getItem("token"))?.state?.user?.token;
    getAllProducts();
  }, []);

  const handleEdit = (e, id) => {
    e.preventDefault();
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${url}/deleteproduct/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.msg);
        return;
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="backdrop-blur-xl bg-slate-800/70 border border-slate-700/50 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-gradient-to-r from-slate-700/50 to-blue-900/30">
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Stock</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-cyan-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${
                    index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-900/40"
                  }`}
                >
                  <td className="px-6 py-4 text-cyan-400 font-semibold">#{index + 1}</td>
                  <td className="px-6 py-4 text-slate-200 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-slate-200 font-semibold">${product.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock > 20
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : product.stock > 0
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {product.stock > 0 ? product.stock : "Agotado"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleEdit(e, product.id)}
                        className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-300 shadow-[0_4px_15px_rgba(34,211,238,0.3)] hover:shadow-[0_6px_20px_rgba(34,211,238,0.5)] hover:scale-110 active:scale-95"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-300 shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)] hover:scale-110 active:scale-95"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
