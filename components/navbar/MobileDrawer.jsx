"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, PlusCircle, ArrowRight, Info, PhoneCall } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function MobileDrawer({
  isOpen,
  onClose,
  onOpenAddBike,
}) {
  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    onClose();
    const element = document.querySelector(targetId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${
        isOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* 1. Full Dark Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 z-[101] transition-opacity duration-300 ease-in-out"
        aria-hidden="true"
      />

      {/* 2. Solid 100% Opaque Pure White Slide-out Drawer Panel */}
      <div
        style={{ backgroundColor: "#ffffff", opacity: 1 }}
        className={`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white text-slate-900 shadow-2xl flex flex-col justify-between p-6 z-[102] transform transition-transform duration-300 ease-out border-l border-slate-200 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="space-y-6">
          
          {/* Brand Logo & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <BrandLogo />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 block">
              Menu
            </span>

            <div className="space-y-2 pt-1">
              {/* About Us */}
              <Link
                href="/about"
                onClick={onClose}
                className="w-full px-4 py-3.5 rounded-xl bg-[#eff4fc] hover:bg-emerald-50/80 border border-slate-200 transition-all flex items-center justify-between group active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#007e22] flex items-center justify-center">
                    <Info className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-[#007e22]">
                    About Us
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#007e22] group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                onClick={onClose}
                className="w-full px-4 py-3.5 rounded-xl bg-[#eff4fc] hover:bg-emerald-50/80 border border-slate-200 transition-all flex items-center justify-between group active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#007e22] flex items-center justify-center">
                    <PhoneCall className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-[#007e22]">
                    Contact
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#007e22] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <Link
            href="/admin"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Staff Admin Portal</span>
          </Link>

          <div className="text-[11px] text-slate-500 text-center space-y-1">
            <p className="font-bold text-slate-700">Demo Bikes Marketplace</p>
            <p className="text-slate-400">support@demobikes.com</p>
          </div>
        </div>

      </div>
    </div>
  );
}
