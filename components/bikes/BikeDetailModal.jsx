"use client";

import { useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  X, 
  Share2,
  CheckCircle2,
  Bike as BikeIcon
} from "lucide-react";

export default function BikeDetailModal({ bike, onClose }) {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!bike) return null;

  const formatPrice = (val) => {
    if (!val) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cleanPhone = bike.contact_number ? bike.contact_number.replace(/[^\d]/g, "") : "";
  const whatsappNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello ${bike.seller_name || ""}, I am interested in your ${bike.bike_model} listed on Demo Bikes for ${formatPrice(bike.selling_price)}. Is it still available?`
  )}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${bike.city || "Tamil Nadu"}, India`
  )}`;

  const brandName = bike.brands?.name || bike.brand_name || "Motorcycle";
  const typeName = bike.bike_types?.name || bike.bike_type || "Sports Bike";
  const regYear = bike.registration_year || bike.year_of_model || "2024";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="bg-white w-full max-w-lg min-h-screen sm:min-h-0 sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[220px] sm:max-w-[280px]">
              {bike.bike_model}
            </h2>
          </div>

          {/* Official Demo Bikes Brand Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0b2d38] flex items-center justify-center text-white shadow-xs">
              <BikeIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:flex w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* 2. Hero Bike Image with Pagination Dots */}
          <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden select-none">
            <img
              src={bike.bike_image_url}
              alt={bike.bike_model}
              className="w-full h-full object-cover"
            />
            
            {/* Image Pagination Dots Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>

            {/* Status Pill */}
            <div className="absolute top-3 left-3 bg-[#007e22] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          {/* 3. Title, Price and Location */}
          <div className="px-5 pt-4 pb-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {bike.bike_model}
            </h1>

            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0b2d38] tracking-tight">
                {formatPrice(bike.selling_price)}
              </span>
              <div className="flex items-center gap-1 text-slate-600 text-sm font-medium">
                <MapPin className="w-4 h-4 text-[#007e22]" />
                <span>{bike.city || "Chennai"}</span>
              </div>
            </div>
          </div>

          {/* 4. Action Buttons (WhatsApp, Location, Call) */}
          <div className="px-5 py-3">
            <div className="grid grid-cols-3 gap-2.5">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-white flex-shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Location Button */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center shadow-xs"
              >
                <MapPin className="w-4 h-4 text-slate-700 flex-shrink-0" />
                <span>Location</span>
              </a>

              {/* Call Button */}
              <a
                href={`tel:${bike.contact_number}`}
                className="bg-[#007e22] hover:bg-[#006e1e] text-white font-bold text-xs sm:text-sm py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 text-center"
              >
                <Phone className="w-4 h-4 fill-white flex-shrink-0" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* 5. Specifications Table */}
          <div className="px-5 pt-3 pb-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-2.5">
              Specifications
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100 shadow-sm">
              
              {/* Brand */}
              <div className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Brand</span>
                <span className="text-slate-900 font-bold">{brandName}</span>
              </div>

              {/* Model Year / Registration Year */}
              <div className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Model Year</span>
                <span className="text-slate-900 font-bold">{regYear}</span>
              </div>

              {/* Kilometers Driven */}
              <div className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Kilometers Driven</span>
                <span className="text-slate-900 font-bold">
                  {bike.kilometer_driven != null ? `${Number(bike.kilometer_driven).toLocaleString()} km` : "N/A"}
                </span>
              </div>

              {/* Body Type */}
              <div className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Body Type</span>
                <span className="text-slate-900 font-bold">{typeName}</span>
              </div>

              {/* Ownership */}
              <div className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Ownership</span>
                <span className="text-slate-900 font-bold">{bike.number_of_owners || "1"}</span>
              </div>

              {/* Seller Name */}
              <div className="px-4 py-3 flex items-center justify-between text-sm bg-slate-50/50">
                <span className="text-slate-500 font-medium">Seller</span>
                <span className="text-slate-900 font-bold">{bike.seller_name || "Verified Seller"}</span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
