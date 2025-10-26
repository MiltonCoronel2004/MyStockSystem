export const Form = ({ children, title, Legend, onSubmit }) => {
  return (
    <div className="relative flex flex-col justify-center items-center gap-6 p-8 rounded-3xl backdrop-blur-xl bg-linear-to-br from-slate-800/90 via-blue-900/80 to-slate-900/90 border border-blue-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] max-w-md w-full overflow-hidden before:absolute before:inset-0 before:rounded-3xl before:bg-linear-to-br before:from-blue-400/5 before:to-cyan-500/5 before:-z-10">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-linear-to-br from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <h2 className="font-black text-4xl bg-linear-to-r from-blue-200 via-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
        {title}
      </h2>

      <form className="flex flex-col gap-4 w-full relative z-10" onSubmit={onSubmit}>
        {children}
      </form>

      {Legend && <Legend />}
    </div>
  );
};
