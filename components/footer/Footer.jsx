"use client";

import Link from "next/link";
import { Bike } from "lucide-react";

export default function Footer({ className = "" }) {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={`bg-white border-t border-slate-200/80 pt-16 pb-12 font-sans ${className}`} id="about">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          
          {/* Column 1: Brand Info (Spans 5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 group select-none"
              title="Demo Bikes - Home"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0b2d38] flex items-center justify-center p-2 shadow-xs group-hover:shadow-md transition-all duration-200 border border-slate-700/30">
                <Bike className="w-5 h-5 text-white stroke-[2.2] group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2d38] group-hover:text-[#007e22] transition-colors">
                  DEMO <span className="text-emerald-600">BIKES</span>
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed font-normal">
              Your trusted marketplace for quality pre-owned motorcycles. Buy and sell bikes with complete transparency.
            </p>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-[#0b2d38]">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#007e22] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#007e22] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (Spans 3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-[#0b2d38]">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li>
                <a
                  href="#terms"
                  className="hover:text-[#007e22] transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-[#007e22] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#refund"
                  className="hover:text-[#007e22] transition-colors"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="#cancellation"
                  className="hover:text-[#007e22] transition-colors"
                >
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4" id="contact">
            <h4 className="text-sm font-bold text-[#0b2d38]">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li>
                <a
                  href="mailto:support@demobikes.com"
                  className="hover:text-[#007e22] transition-colors font-medium"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col items-center justify-center space-y-2 text-center text-xs text-slate-500">
          <p>© 2026 Demo Bikes. All rights reserved.</p>
          <p className="text-xs text-slate-600 font-medium">
            Powered by{" "}
            <span className="text-[#dc2626] font-bold tracking-wide">
              SEYALI
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}
