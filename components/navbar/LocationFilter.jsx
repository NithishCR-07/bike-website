"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";

export const TAMIL_NADU_CITIES = [
  "All",
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Salem",
  "Trichy",
  "Tiruppur",
  "Erode",
  "Vellore",
  "Tirunelveli",
  "Thanjavur"
];

export default function LocationFilter({ selectedLocation = "All", onLocationSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    if (onLocationSelect) {
      onLocationSelect(city);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300/90 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-all shadow-sm active:scale-95 select-none"
        aria-expanded={isOpen}
        aria-label="Filter bikes by location"
      >
        <MapPin className="w-4 h-4 text-slate-700 stroke-[2.2]" />
        <span className="font-semibold text-slate-800 truncate max-w-[90px] sm:max-w-[120px]">
          {selectedLocation}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Select Location
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {TAMIL_NADU_CITIES.map((city) => {
              const isSelected = selectedLocation.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                    <span>{city}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
