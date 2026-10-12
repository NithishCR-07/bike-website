"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  AlertCircle,
  Share2
} from "lucide-react";
import { fetchBikeBySlugOrId } from "@/services/bikesService";
import BrandLogo from "@/components/navbar/BrandLogo";
import BikeDetailSkeleton from "@/components/bikes/BikeDetailSkeleton";

export default function BikeDetailView({ paramsPromise }) {
  const router = useRouter();
  const resolvedParams = typeof paramsPromise?.then === "function" ? use(paramsPromise) : paramsPromise;
  const slug = resolvedParams?.slug || "";

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("demobikes_admin_auth");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role === "admin") {
            setIsAdmin(true);
          }
        } catch {
          setIsAdmin(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const currentBike = await fetchBikeBySlugOrId(slug);

        if (!currentBike) {
          setError("Bike listing not found in the database.");
        } else {
          setBike(currentBike);
        }
      } catch (err) {
        console.error("Error loading bike details:", err);
        setError(err.message || "Failed to load bike details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${bike?.bike_model}`,
            text: `${bike?.bike_model} - ${formatPrice(bike?.selling_price)} in ${bike?.city}`,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        console.warn("Share failed:", err);
      }
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return String(dateStr);
    }
  };

  if (loading) {
    return <BikeDetailSkeleton />;
  }

  if (error || !bike) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bike Not Found</h2>
          <p className="text-sm text-slate-500">{error || "The requested bike listing does not exist in the database."}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </Link>
        </div>
      </div>
    );
  }

  const cleanPhone = bike.contact_number ? bike.contact_number.replace(/[^\d]/g, "") : "";
  const whatsappNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello ${bike.seller_name || ""}, I am interested in your ${bike.bike_model} listed for ${formatPrice(bike.selling_price)}. Is it available?`
  )}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${bike.city || "Tamil Nadu"}, India`
  )}`;

  const brandName = bike.brands?.name || "Motorcycle";
  const typeName = bike.bike_types?.name || "Standard";
  const regYear = bike.registration_year || bike.year_of_model || "N/A";

  const handleBack = () => {
    if (typeof window !== "undefined") {
      // 1. If user came from /admin
      if (document.referrer && document.referrer.includes("/admin")) {
        router.push("/admin");
        return;
      }

      // 2. If there is history in this tab
      if (window.history.length > 1 && document.referrer) {
        router.back();
        return;
      }

      // 3. If admin session exists in active sessionStorage, go to /admin
      try {
        const adminSession = sessionStorage.getItem("demobikes_admin_auth");
        if (adminSession) {
          const parsed = JSON.parse(adminSession);
          if (parsed && parsed.role === "admin") {
            router.push("/admin");
            return;
          }
        }
      } catch (err) {
        console.warn(err);
      }

      // 4. Default fallback to home
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 font-sans pb-20">
      
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-sm font-bold transition-colors cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>{isAdmin ? "Back to Admin" : "Back"}</span>
            </button>
            
            <BrandLogo className="scale-90 origin-left hidden sm:flex" />
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#007e22] text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <span>Admin Console</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Centered Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        
        {/* Centered Bike Image */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/10] bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 flex items-center justify-center">
            <img
              src={bike.bike_image_url}
              alt={bike.bike_model}
              className="w-full h-full object-cover sm:object-contain bg-slate-50"
            />
            
            {/* Brand Pill */}
            <div className="absolute top-4 left-4 bg-[#0b2d38] text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
              {brandName}
            </div>

            {/* Status Pill */}
            <div className="absolute top-4 right-4 bg-[#007e22] text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs capitalize">
              {bike.status || "Available"}
            </div>
          </div>
        </div>

        {/* Centered Title, Price & Primary Info */}
        <div className="text-center space-y-3">
          
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="bg-[#eff4fc] text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
              {brandName}
            </span>
            <span className="bg-emerald-50 text-[#007e22] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              {typeName}
            </span>
            <span className="bg-[#eff4fc] text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
              Year {regYear}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {bike.bike_model}
          </h1>

          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="text-3xl sm:text-4xl font-black text-[#0b2d38] tracking-tight">
              {formatPrice(bike.selling_price)}
            </span>
            <span className="text-slate-300 font-light text-2xl">|</span>
            <span className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-xs">
              <MapPin className="w-4 h-4 text-[#007e22] flex-shrink-0" />
              <span>{bike.city}</span>
            </span>
          </div>

        </div>

        {/* Action Buttons: WhatsApp, Location, Call */}
        <div className="max-w-xl mx-auto w-full grid grid-cols-3 gap-3">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 text-center"
          >
            <MessageSquare className="w-4 h-4 fill-white flex-shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Location */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center shadow-xs"
          >
            <MapPin className="w-4 h-4 text-slate-700 flex-shrink-0" />
            <span>Location</span>
          </a>

          {/* Call */}
          <a
            href={`tel:${bike.contact_number}`}
            className="bg-[#007e22] hover:bg-[#006e1e] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 text-center"
          >
            <Phone className="w-4 h-4 fill-white flex-shrink-0" />
            <span>Call</span>
          </a>
        </div>

        {/* Database Details Table */}
        <div className="max-w-3xl mx-auto w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
            Bike Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            
            {/* Brand */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Brand</span>
              <span className="text-slate-900 font-bold">{brandName}</span>
            </div>

            {/* Model */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Bike Model</span>
              <span className="text-slate-900 font-bold">{bike.bike_model}</span>
            </div>

            {/* Registration Year */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Registration Year</span>
              <span className="text-slate-900 font-bold">{regYear}</span>
            </div>

            {/* Body Type */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Body / Type</span>
              <span className="text-slate-900 font-bold">{typeName}</span>
            </div>

            {/* Kilometers Driven */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Kilometers Driven</span>
              <span className="text-slate-900 font-bold">
                {bike.kilometer_driven != null ? `${Number(bike.kilometer_driven).toLocaleString()} km` : "N/A"}
              </span>
            </div>

            {/* Number of Owners */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Number of Owners</span>
              <span className="text-slate-900 font-bold">
                {bike.number_of_owners ? `${bike.number_of_owners} Owner${Number(bike.number_of_owners) > 1 ? "s" : ""}` : "1 Owner"}
              </span>
            </div>

            {/* Selling Price */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Selling Price</span>
              <span className="text-[#007e22] font-black text-base">{formatPrice(bike.selling_price)}</span>
            </div>

            {/* City */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">City / Location</span>
              <span className="text-slate-900 font-bold">{bike.city}</span>
            </div>

          </div>

          {/* Seller Information Section */}
          <div className="pt-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Seller Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm mt-3">
              {/* Seller Name */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Seller Name</span>
                <span className="text-slate-900 font-bold">{bike.seller_name || "N/A"}</span>
              </div>

              {/* Contact Number */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Contact Number</span>
                <a
                  href={`tel:${bike.contact_number}`}
                  className="text-[#007e22] hover:text-[#006e1e] font-bold hover:underline"
                >
                  {bike.contact_number || "N/A"}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Email Address</span>
                <a
                  href={`mailto:${bike.email_address}`}
                  className="text-[#007e22] hover:text-[#006e1e] font-bold hover:underline truncate max-w-[180px] sm:max-w-none"
                >
                  {bike.email_address || "N/A"}
                </a>
              </div>

              {/* Listed On */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Listed Date</span>
                <span className="text-slate-900 font-bold">{formatDate(bike.created_at)}</span>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
