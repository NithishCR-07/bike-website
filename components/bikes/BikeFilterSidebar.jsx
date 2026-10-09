"use client";

import { RotateCcw } from "lucide-react";

export default function BikeFilterSidebar({
  sortBy = "latest",
  onSortChange,
  maxPrice = 500000,
  onMaxPriceChange,
  maxKm = 100000,
  onMaxKmChange,
  ownerFilter = "all",
  onOwnerChange,
  yearSort = "all",
  onYearSortChange,
  onResetFilters,
  className = ""
}) {
  const isFiltered = 
    sortBy !== "latest" || 
    maxPrice < 500000 || 
    maxKm < 100000 || 
    ownerFilter !== "all" ||
    yearSort !== "all";

  const handleOwnerClick = (val) => {
    if (ownerFilter === val) {
      onOwnerChange && onOwnerChange("all");
    } else {
      onOwnerChange && onOwnerChange(val);
    }
  };

  const minPriceVal = 20000;
  const maxPriceVal = 500000;
  const pricePercent = Math.min(
    100,
    Math.max(0, ((maxPrice - minPriceVal) / (maxPriceVal - minPriceVal)) * 100)
  );

  const minKmVal = 5000;
  const maxKmVal = 100000;
  const kmPercent = Math.min(
    100,
    Math.max(0, ((maxKm - minKmVal) / (maxKmVal - minKmVal)) * 100)
  );

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 font-sans text-slate-800 ${className}`}
    >
      {/* 1. Header with Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight font-display">
          Filters
        </h3>

        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-[#007e22] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. SORT BY (Price / Latest) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          SORT BY
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onSortChange && onSortChange("latest")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              sortBy === "latest"
                ? "bg-[#007e22] text-white shadow-xs"
                : "bg-[#eff4fc] border border-slate-200 text-slate-700 hover:border-[#007e22]"
            }`}
          >
            Latest
          </button>

          <button
            type="button"
            onClick={() => onSortChange && onSortChange("low_price")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              sortBy === "low_price"
                ? "bg-[#007e22] text-white shadow-xs"
                : "bg-[#eff4fc] border border-slate-200 text-slate-700 hover:border-[#007e22]"
            }`}
          >
            Low Price
          </button>

          <button
            type="button"
            onClick={() => onSortChange && onSortChange("high_price")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              sortBy === "high_price"
                ? "bg-[#007e22] text-white shadow-xs"
                : "bg-[#eff4fc] border border-slate-200 text-slate-700 hover:border-[#007e22]"
            }`}
          >
            High Price
          </button>
        </div>
      </div>

      {/* 3. PRICE RANGE SLIDER */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
          <span>PRICE RANGE</span>
        </div>

        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="range"
              min={minPriceVal}
              max={maxPriceVal}
              step="10000"
              value={maxPrice}
              onChange={(e) =>
                onMaxPriceChange && onMaxPriceChange(Number(e.target.value))
              }
              style={{
                background: `linear-gradient(to right, #007e22 0%, #007e22 ${pricePercent}%, #eff4fc ${pricePercent}%, #eff4fc 100%)`,
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>₹0</span>
            <span>₹5.0L</span>
          </div>
        </div>
      </div>

      {/* 4. KILOMETERS SLIDER */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
          <span>KILOMETERS</span>
        </div>

        <div className="space-y-2">
          <div className="relative flex items-center">
            <input
              type="range"
              min={minKmVal}
              max={maxKmVal}
              step="5000"
              value={maxKm}
              onChange={(e) =>
                onMaxKmChange && onMaxKmChange(Number(e.target.value))
              }
              style={{
                background: `linear-gradient(to right, #007e22 0%, #007e22 ${kmPercent}%, #eff4fc ${kmPercent}%, #eff4fc 100%)`,
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>0</span>
            <span>100K km</span>
          </div>
        </div>
      </div>

      {/* 5. OWNER FILTER */}
      <div className="space-y-3 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          OWNER
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: "1", label: "1st" },
            { id: "2", label: "2nd" },
            { id: "3+", label: "3+" },
          ].map((item) => {
            const isSelected = ownerFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleOwnerClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#007e22] text-white shadow-xs"
                    : "bg-[#eff4fc] border border-slate-200 text-slate-700 hover:border-[#007e22]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. REGISTRATION / AGE SORT */}
      <div className="space-y-3 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          SORT BY
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() =>
              onYearSortChange &&
              onYearSortChange(yearSort === "newest" ? "all" : "newest")
            }
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              yearSort === "newest" || yearSort === "all"
                ? "bg-[#007e22] text-white shadow-xs"
                : "bg-[#eff4fc] border border-slate-200 text-slate-700 hover:border-[#007e22]"
            }`}
          >
            Latest
          </button>

          <button
            type="button"
            onClick={() =>
              onYearSortChange &&
              onYearSortChange(yearSort === "oldest" ? "all" : "oldest")
            }
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              yearSort === "oldest"
                ? "bg-[#007e22] text-white shadow-xs"
                : "bg-[#eff4fc] border border-slate-200 text-slate-700 hover:border-[#007e22]"
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

    </div>
  );
}
