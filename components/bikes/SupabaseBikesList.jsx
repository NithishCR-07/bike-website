"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bike, Loader2, RefreshCw } from "lucide-react";
import { fetchBikes } from "../../services/bikesService";
import { createClient } from "../../lib/supabase/client";
import BikeCard from "./BikeCard";
import { CATEGORY_CARDS } from "./CategoryFilterCards";

export default function SupabaseBikesList({ 
  refreshKey, 
  searchQuery = "", 
  locationFilter = "All", 
  categoryFilter = null,
  brandFilter = null,
  sortBy = "latest",
  maxPrice = 500000,
  maxKm = 100000,
  ownerFilter = "all",
  yearSort = "all"
}) {
  const router = useRouter();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadBikes = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsRefreshing(true);
      setError(null);
      const data = await fetchBikes();
      setBikes(data || []);
    } catch (err) {
      console.error("Fetch bikes error in UI:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and manual refresh dependency
  useEffect(() => {
    loadBikes(false);
  }, [refreshKey, loadBikes]);

  // Real-time Supabase Database Listener for Instant UI Sync
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel("bikes-live-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bikes" },
        () => {
          loadBikes(false);
        }
      )
      .subscribe();

    const intervalId = setInterval(() => {
      loadBikes(false);
    }, 6000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [loadBikes]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-xs font-semibold">Fetching live bikes from Supabase...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-center my-6 space-y-3">
        <p className="text-sm font-bold">Failed to load bikes: {error}</p>
        <button
          onClick={() => loadBikes(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white rounded-2xl border border-dashed border-slate-300 my-6 shadow-sm space-y-3 font-sans">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Bike className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No bikes found in Supabase table</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Add a bike using the form above to view its listing and full details page.
        </p>
        <button
          onClick={() => loadBikes(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Checking..." : "Refresh From Database"}</span>
        </button>
      </div>
    );
  }

  // Apply real-time multi-criteria filters
  const filteredBikes = bikes.filter((bike) => {
    // 1. Search filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const modelMatch = (bike.bike_model || "").toLowerCase().includes(q);
      const brandMatch = (bike.brands?.name || "").toLowerCase().includes(q);
      const cityMatch = (bike.city || "").toLowerCase().includes(q);
      const typeMatch = (bike.bike_types?.name || "").toLowerCase().includes(q);
      if (!modelMatch && !brandMatch && !cityMatch && !typeMatch) return false;
    }

    // 2. Location filter
    if (locationFilter && locationFilter !== "All") {
      const city = (bike.city || "").toLowerCase().trim();
      if (!city.includes(locationFilter.toLowerCase().trim())) return false;
    }

    // 3. Category / Style filter
    if (categoryFilter && categoryFilter.trim()) {
      const catKey = categoryFilter.toLowerCase().trim();
      const matchedCard = CATEGORY_CARDS.find(
        (c) => c.id === catKey || c.label.toLowerCase() === catKey
      );

      if (matchedCard) {
        const typeName = (bike.bike_types?.name || "").toLowerCase();
        const modelName = (bike.bike_model || "").toLowerCase();
        const brandName = (bike.brands?.name || "").toLowerCase();

        const typeMatch = matchedCard.typeNames.some(
          (t) => typeName.includes(t.toLowerCase()) || t.toLowerCase().includes(typeName)
        );
        const keywordMatch = matchedCard.keywords.some(
          (k) => modelName.includes(k) || typeName.includes(k) || brandName.includes(k)
        );

        if (!typeMatch && !keywordMatch) return false;
      } else {
        const type = (bike.bike_types?.name || "").toLowerCase().trim();
        const model = (bike.bike_model || "").toLowerCase().trim();
        if (!type.includes(catKey) && !catKey.includes(type) && !model.includes(catKey)) return false;
      }
    }

    // 4. Brand filter
    if (brandFilter && brandFilter.trim()) {
      const bKey = brandFilter.toLowerCase().trim();
      const brandName = (bike.brands?.name || "").toLowerCase().trim();
      const modelName = (bike.bike_model || "").toLowerCase().trim();
      if (!brandName.includes(bKey) && !modelName.includes(bKey) && !bKey.includes(brandName)) return false;
    }

    // 5. Price Range filter
    if (maxPrice && Number(bike.selling_price) > maxPrice) {
      return false;
    }

    // 6. Kilometer filter
    if (maxKm && bike.kilometer_driven && Number(bike.kilometer_driven) > maxKm) {
      return false;
    }

    // 7. Number of Owners filter
    if (ownerFilter && ownerFilter !== "all") {
      const owners = Number(bike.number_of_owners) || 1;
      if (ownerFilter === "1" && owners !== 1) return false;
      if (ownerFilter === "2" && owners !== 2) return false;
      if (ownerFilter === "3+" && owners < 3) return false;
    }

    return true;
  });

  // Apply real-time sorting
  const sortedBikes = [...filteredBikes].sort((a, b) => {
    // Model Year sort priority if active
    if (yearSort === "newest") {
      const yearA = Number(a.registration_year) || 0;
      const yearB = Number(b.registration_year) || 0;
      if (yearB !== yearA) return yearB - yearA;
    } else if (yearSort === "oldest") {
      const yearA = Number(a.registration_year) || 0;
      const yearB = Number(b.registration_year) || 0;
      if (yearA !== yearB) return yearA - yearB;
    }

    // Price and Latest Sorting
    if (sortBy === "low_price") {
      return (Number(a.selling_price) || 0) - (Number(b.selling_price) || 0);
    }
    if (sortBy === "high_price") {
      return (Number(b.selling_price) || 0) - (Number(a.selling_price) || 0);
    }
    
    // Default: Latest (by id or created_at desc)
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });

  return (
    <div className="font-sans">
      {sortedBikes.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm space-y-2">
          <p className="text-sm font-bold text-slate-700">No bikes found matching these filters</p>
          <p className="text-xs text-slate-400">Try adjusting your price range, kilometers, or clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
          {sortedBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      )}
    </div>
  );
}
