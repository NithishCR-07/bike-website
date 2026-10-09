"use client";

import { useState } from "react";
import Link from "next/link";

export const CATEGORY_ITEMS = [
  { id: "scooters", label: "Scooters", type: "category", query: "Scooter" },
  { id: "motor-bikes", label: "Motor Bikes", type: "category", query: "Street" },
  { id: "sports-bikes", label: "Sports Bikes", type: "category", query: "Sports" },
  { id: "tourers", label: "Tourers", type: "category", query: "Touring" },
  { id: "about-us", label: "About Us", type: "page", href: "#about" },
  { id: "contact", label: "Contact", type: "page", href: "#contact" }
];

export default function CategoryNav({ 
  activeCategory = null, 
  onCategorySelect,
  className = "" 
}) {
  const [active, setActive] = useState(activeCategory);

  const handleClick = (item, e) => {
    if (item.type === "category") {
      e.preventDefault();
      const newActive = activeCategory === item.id ? null : item.id;
      if (onCategorySelect) {
        onCategorySelect(newActive);
      }
    } else {
      // Smooth scroll or navigation
      if (item.href?.startsWith("#")) {
        const target = document.querySelector(item.href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <nav className={`w-full overflow-x-auto no-scrollbar select-none ${className}`}>
      <ul className="flex items-center gap-6 sm:gap-8 min-w-max py-2.5">
        {CATEGORY_ITEMS.map((item) => {
          const isCurrent = activeCategory === item.id;
          return (
            <li key={item.id}>
              {item.type === "category" ? (
                <button
                  type="button"
                  onClick={(e) => handleClick(item, e)}
                  className={`text-sm font-semibold transition-all relative py-1 ${
                    isCurrent
                      ? "text-[#0b2d38] font-black"
                      : "text-slate-600 hover:text-slate-900 font-medium"
                  }`}
                >
                  <span>{item.label}</span>
                  {isCurrent && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0b2d38] rounded-full animate-in fade-in" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={(e) => handleClick(item, e)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
