"use client";

import Link from "next/link";
import { Bike } from "lucide-react";

export default function BrandLogo({ className = "" }) {
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-3 group select-none ${className}`}
      title="Demo Bikes - Home"
    >
      {/* Demo Bikes Emblem */}
      <div className="relative w-10 h-10 rounded-xl bg-[#0b2d38] flex items-center justify-center p-2 shadow-sm group-hover:shadow-md transition-all duration-200 border border-slate-700/30">
        <Bike className="w-5 h-5 text-white stroke-[2.2] group-hover:scale-110 transition-transform duration-200" />
      </div>

      {/* Brand Title */}
      <div className="flex flex-col leading-none">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2d38] group-hover:text-[#007e22] transition-colors">
          DEMO <span className="text-emerald-600">BIKES</span>
        </span>
      </div>
    </Link>
  );
}
