export const Button = ({ type = "submit", value, onClick = undefined }) => {
  return (
    <button
      className="relative px-6 py-3 rounded-xl font-bold text-white bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-[0_4px_20px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
      type={type}
      onClick={onClick}
    >
      <span className="relative z-10">{value}</span>
      <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};
