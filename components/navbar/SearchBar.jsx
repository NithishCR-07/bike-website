"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Bike as BikeIcon, ArrowRight, MapPin } from "lucide-react";
import { fetchBikes, generateBikeSlug } from "@/services/bikesService";

export default function SearchBar({ 
  placeholder = "Search bikes...", 
  onSearchChange,
  className = "" 
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allBikes, setAllBikes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Load bikes once for fast client-side indexing and instant autocomplete
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchBikes();
        if (isMounted) {
          setAllBikes(data || []);
        }
      } catch (err) {
        console.warn("Could not pre-fetch bikes for search bar:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter live results as user types
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      if (onSearchChange) onSearchChange("");
      return;
    }

    if (onSearchChange) onSearchChange(trimmed);

    const filtered = allBikes.filter((bike) => {
      const model = (bike.bike_model || "").toLowerCase();
      const brand = (bike.brands?.name || "").toLowerCase();
      const city = (bike.city || "").toLowerCase();
      const type = (bike.bike_types?.name || "").toLowerCase();
      return (
        model.includes(trimmed) ||
        brand.includes(trimmed) ||
        city.includes(trimmed) ||
        type.includes(trimmed)
      );
    });

    setResults(filtered.slice(0, 6));
    setIsOpen(true);
  }, [query, allBikes, onSearchChange]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    if (onSearchChange) onSearchChange("");
  };

  const handleSelectBike = (bike) => {
    const slug = generateBikeSlug(bike);
    setIsOpen(false);
    setQuery("");
    router.push(`/bikes/${slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectBike(results[0]);
    }
  };

  const formatPrice = (val) => {
    if (!val && val !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative w-full">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-700 stroke-[2.2]" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-2.5 bg-[#eff4fc] border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all shadow-xs"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Live Results Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
          <div className="px-4 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Matching Live Bikes ({results.length})</span>
            <span className="text-[10px] text-slate-400 lowercase">click to view</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {results.map((bike) => (
              <div
                key={bike.id}
                onClick={() => handleSelectBike(bike)}
                className="px-4 py-3 flex items-center gap-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                {/* Bike Thumbnail */}
                <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={bike.bike_image_url}
                    alt={bike.bike_model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Bike Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate group-hover:text-[#007e22] transition-colors">
                      {bike.bike_model}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                      {bike.brands?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-extrabold text-[#0b2d38]">
                      {formatPrice(bike.selling_price)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {bike.city}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
