"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, LogOut } from "lucide-react";
import { logoutAdmin } from "@/services/adminAuthService";

export default function AdminHeader({ onLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      if (onLogout) {
        onLogout();
      }
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs font-sans">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Left: Official Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-9 h-9 rounded-xl bg-[#0b2d38] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-all">
              <Bike className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0b2d38] font-display leading-none block">
                DEMO <span className="text-emerald-600">BIKES</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Admin Console
              </span>
            </div>
          </Link>

          {/* 2. Right: Clean Logout Button Only */}
          <div>
            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
              title="Log out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Exiting..." : "Log Out"}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
