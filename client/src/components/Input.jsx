import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

export const Input = ({ type, name, placeholder, id, title, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  const icon =
    type === "email" ? (
      <Mail className="w-5 h-5 text-slate-400" />
    ) : type === "password" ? (
      <Lock className="w-5 h-5 text-slate-400" />
    ) : (
      <User className="w-5 h-5 text-slate-400" />
    );

  const finalPlaceholder =
    placeholder || (type === "email" ? "Ingrese su correo electrónico" : type === "password" ? "Ingrese su contraseña" : "Ingrese un valor");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-blue-200 tracking-wide">
        {title}
      </label>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60 backdrop-blur-sm border-2 transition-all duration-300 shadow-sm text-white ${
          focused ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]" : "border-slate-700/60 hover:border-cyan-600/50"
        }`}
      >
        {icon}
        <input
          id={id}
          type={type}
          name={name}
          placeholder={finalPlaceholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="bg-transparent outline-none w-full text-white placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};
