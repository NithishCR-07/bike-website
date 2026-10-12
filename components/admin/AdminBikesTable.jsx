"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  SlidersHorizontal,
  Bike as BikeIcon,
  MapPin
} from "lucide-react";
import { generateBikeSlug } from "@/services/bikesService";

export default function AdminBikesTable({
  bikes = [],
  onEditBike,
  onDeleteBike,
  onToggleStatus,
  updatingStatusId = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  // Get distinct brands from current inventory
  const availableBrands = useMemo(() => {
    const set = new Set();
    bikes.forEach((b) => {
      const name = b.brands?.name || "Other";
      set.add(name);
    });
    return Array.from(set).sort();
  }, [bikes]);

  // Filtered bikes
  const filteredBikes = useMemo(() => {
    return bikes.filter((b) => {
      // Search
      const searchTarget = `${b.bike_model} ${b.seller_name} ${b.city} ${b.brands?.name || ""}`.toLowerCase();
      const matchesSearch = !searchQuery || searchTarget.includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus =
        statusFilter === "all" || (b.status || "available").toLowerCase() === statusFilter.toLowerCase();

      // Brand
      const matchesBrand =
        brandFilter === "all" || (b.brands?.name || "Other").toLowerCase() === brandFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesBrand;
    });
  }, [bikes, searchQuery, statusFilter, brandFilter]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };


  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden font-sans">
      
      {/* 1. Table Topbar with Search & Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3.5 bg-slate-50/50">
        
        {/* Left: Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model, seller, city..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#eff4fc] border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
          />
        </div>

        {/* Right: Status & Brand Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#007e22] cursor-pointer"
            >
              <option value="all">All ({bikes.length})</option>
              <option value="available">Available</option>
              <option value="sold">Sold Out</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span>Brand:</span>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-[#007e22] cursor-pointer"
              >
                <option value="all">All Brands</option>
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          )}

        </div>

      </div>

      {/* 2. Responsive Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Bike</th>
              <th className="py-3.5 px-4">Register Year</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Seller & City</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {filteredBikes.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                  <BikeIcon className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">No bikes match your search or filter</p>
                  <p className="text-xs text-slate-400">Try adjusting the search criteria or click "Post New Bike"</p>
                </td>
              </tr>
            ) : (
              filteredBikes.map((bike) => {
                const slug = generateBikeSlug(bike);
                const isUpdating = updatingStatusId === bike.id;
                const isAvailable = (bike.status || "available") === "available";

                return (
                  <tr
                    key={bike.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    
                    {/* 1. Bike (Image + Model Name Only) */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm relative">
                          <img
                            src={bike.bike_image_url}
                            alt={bike.bike_model}
                            className="w-full h-full object-cover"
                          />
                          {!isAvailable && (
                            <div className="absolute inset-0 bg-red-900/60 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                Sold
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {bike.bike_model}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Register Year */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-slate-800">
                        {bike.registration_year || bike.year_of_model || "—"}
                      </span>
                    </td>

                    {/* 3. Price */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-[#0b2d38] font-stylized">
                        {formatPrice(bike.selling_price)}
                      </span>
                    </td>

                    {/* 4. Seller & City (Seller on top, City down below, no phone number) */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-xs truncate max-w-[140px]">
                          {bike.seller_name || "—"}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[120px]">{bike.city || "Tamil Nadu"}</span>
                        </div>
                      </div>
                    </td>

                    {/* 5. Status Badge & Quick Toggle */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() =>
                          onToggleStatus(bike.id, isAvailable ? "sold" : "available")
                        }
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                          isAvailable
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                            : "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
                        } disabled:opacity-50`}
                        title="Click to toggle status between Available and Sold"
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* 6. Action Buttons */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        
                        {/* View on Public Website */}
                        <Link
                          href={`/bikes/${slug}`}
                          className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="View bike listing page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditBike(bike)}
                          className="p-2 rounded-xl text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit bike specifications and price"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteBike(bike)}
                          className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Permanently delete bike"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
