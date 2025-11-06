import { Outlet, useNavigate } from "react-router";
import { useStore } from "../../store/useStore";
import { useEffect } from "react";

export default function Public() {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user.token) return navigate("/");
  }, []);

  if (user.token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
          <div className="absolute inset-2 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-600/20 blur-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <Outlet />
    </div>
  );
}
