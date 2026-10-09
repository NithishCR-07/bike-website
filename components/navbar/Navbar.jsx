"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import BrandLogo from "./BrandLogo";
import SearchBar from "./SearchBar";
import MobileDrawer from "./MobileDrawer";

export default function Navbar({
  onSearch,
  onOpenAddBike,
  className = ""
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs font-sans ${className}`}>
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            
            {/* 1. Left: Brand Logo */}
            <div className="flex-shrink-0">
              <BrandLogo />
            </div>

            {/* 2. Center: Real-time Search Bar (Desktop) */}
            <div className="flex-1 max-w-xl mx-auto hidden md:block">
              <SearchBar onSearchChange={onSearch} />
            </div>

            {/* 3. Right: Navigation Links & Mobile Menu Toggle */}
            <div className="flex items-center gap-6 flex-shrink-0">
              
              {/* Desktop Navigation Links (About & Contact Only) */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700">
                <Link
                  href="/about"
                  className="hover:text-[#007e22] transition-colors py-1"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  className="hover:text-[#007e22] transition-colors py-1"
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile Hamburger Button (Strictly visible ONLY on small screens md:hidden) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex md:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors items-center justify-center active:scale-95"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5 stroke-[2.2] text-slate-800" />
              </button>

            </div>

          </div>

          {/* Mobile Search Bar (Visible only on mobile devices) */}
          <div className="mt-3 block md:hidden">
            <SearchBar onSearchChange={onSearch} />
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer Menu (Rendered outside header to prevent backdrop-blur stacking context bugs) */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAddBike={onOpenAddBike}
      />
    </>
  );
}
