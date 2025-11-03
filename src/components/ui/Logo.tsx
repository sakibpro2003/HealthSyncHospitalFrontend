import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-sky-500 text-lg font-bold text-white shadow-lg">
        HS
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-black text-slate-900">HealthSync</span>
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500">
          Hospital
        </span>
      </div>
    </div>
  );
};

export default Logo;
