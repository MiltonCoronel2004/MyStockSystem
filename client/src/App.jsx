import { BrowserRouter, Routes, Route } from "react-router";
import Public from "./pages/layouts/Public";
import Private from "./pages/layouts/Private";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import CreateProduct from "./pages/CreateProduct";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<Public />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<Private />}>
          <Route index element={<Products />} />
          <Route path="/createproduct" element={<CreateProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404</h1>} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="backdrop-blur-xl bg-slate-800/90 border border-slate-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] rounded-xl"
        bodyClassName="text-slate-200 font-medium"
        progressClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
      />
    </BrowserRouter>
  );
}
