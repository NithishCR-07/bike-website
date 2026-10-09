"use client";

import { Plus } from "lucide-react";

export default function FloatingAddBikeButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: "#007e22", color: "#ffffff" }}
      className={`fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-5 py-3 rounded-full !bg-[#007e22] hover:!bg-[#006e1e] !text-white shadow-xl shadow-emerald-800/30 border border-emerald-400/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-800/40 active:scale-95 cursor-pointer select-none ${className}`}
      aria-label="Post new bike listing"
      title="Post New Bike Listing"
    >
      {/* Plus Icon in White Badge */}
      <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-300">
        <Plus className="w-4 h-4 text-white stroke-[3]" />
      </div>

      {/* Label */}
      <span className="text-sm font-bold tracking-wide text-white">
        Post Bike
      </span>
    </button>
  );
}
