import { useState } from "react";

export const Input = ({ type, name, placeholder, id, title, value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-blue-200 tracking-wide">
        {title}
      </label>
      <input
        className={`px-4 py-3 rounded-xl bg-slate-800/60 backdrop-blur-sm border-2 transition-all duration-300 outline-none shadow-sm text-white placeholder:text-slate-400 ${
          focused ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]" : "border-slate-700/60 hover:border-cyan-600/50"
        }`}
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};
