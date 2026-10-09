"use client";

import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Gauge, 
  MapPin, 
  User, 
  Phone,
  Bike 
} from "lucide-react";
import { generateBikeSlug } from "@/services/bikesService";

export default function BikeCard({ bike }) {
  const router = useRouter();

  if (!bike) return null;

  const bikeSlug = generateBikeSlug(bike);

  const formatPrice = (val) => {
    if (!val && val !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatKm = (km) => {
    if (km == null || isNaN(km)) return "0 km";
    const num = Number(km);
    if (num >= 1000) {
      const kValue = Math.round(num / 1000);
      return `${kValue}K km`;
    }
    return `${num} km`;
  };

  const regYear = bike.registration_year || bike.year_of_model || "2023";
  const owners = bike.number_of_owners || 1;
  const sellerName = bike.seller_name || "Sanjeevan";
  const city = bike.city || "Tamil Nadu";

  const handleCardClick = () => {
    router.push(`/bikes/${bikeSlug}`);
  };

  const handleCallClick = (e) => {
    e.stopPropagation();
    if (bike.contact_number) {
      window.location.href = `tel:${bike.contact_number}`;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#007e22]/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer select-none font-sans"
    >
      {/* 1. Top Bike Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={bike.bike_image_url}
          alt={bike.bike_model}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            bike.status === "sold" ? "grayscale-[30%]" : ""
          }`}
        />

        {/* Status Badge */}
        {bike.status === "sold" && (
          <div className="absolute top-3 left-3 bg-red-600/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-red-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Sold Out</span>
          </div>
        )}

        {bike.status === "reserved" && (
          <div className="absolute top-3 left-3 bg-amber-500/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg border border-amber-300/30">
            Reserved
          </div>
        )}
      </div>

      {/* 2. Card Content Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl sm:text-[26px] font-black text-[#0b2d38] tracking-tight leading-none font-stylized">
              {formatPrice(bike.selling_price)}
            </div>
            {bike.brands?.name && (
              <span className="text-[10px] font-bold text-slate-600 bg-[#eff4fc] border border-slate-200 px-2 py-0.5 rounded-md">
                {bike.brands.name}
              </span>
            )}
          </div>

          {/* Bike Model / Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate group-hover:text-[#007e22] transition-colors font-display">
            {bike.bike_model}
          </h3>

          {/* Inline Specs Row: Year, KM, City, Owners */}
          <div className="flex items-center gap-3.5 text-xs text-slate-500 font-semibold pt-1 flex-wrap">
            {/* Year */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{regYear}</span>
            </div>

            {/* Kilometers Driven */}
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatKm(bike.kilometer_driven)}</span>
            </div>

            {/* City */}
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[100px]">{city}</span>
            </div>

            {/* Owners */}
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{owners}</span>
            </div>
          </div>
        </div>

        {/* 3. Divider Line */}
        <div className="border-t border-slate-100 pt-3">
          {/* 4. Bottom Seller Call Box */}
          <div className="bg-[#eff4fc] rounded-xl p-2.5 flex items-center justify-between border border-slate-200/80 group-hover:border-[#007e22]/30 transition-colors">
            
            {/* Left: Seller Avatar & Name */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Demo Bikes Emblem Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#0b2d38] shadow-sm flex items-center justify-center p-2 flex-shrink-0">
                <Bike className="w-5 h-5 text-white stroke-[2.2]" />
              </div>

              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight capitalize">
                  {sellerName}
                </p>
                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  Dealer
                </p>
              </div>
            </div>

            {/* Right: Round Signature Green Phone Call Button */}
            <button
              type="button"
              onClick={handleCallClick}
              className="w-10 h-10 rounded-full bg-[#007e22] hover:bg-[#006e1e] text-white flex items-center justify-center shadow-md hover:shadow-lg active:scale-90 transition-all flex-shrink-0 cursor-pointer"
              title={`Call ${sellerName}`}
              aria-label={`Call ${sellerName}`}
            >
              <Phone 
                className="w-4 h-4 text-white stroke-[2.2]" 
                style={{ fill: "#ffffff", color: "#ffffff" }}
              />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
