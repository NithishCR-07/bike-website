"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import CategoryFilterCards from "@/components/bikes/CategoryFilterCards";
import PopularBrands from "@/components/bikes/PopularBrands";
import SupabaseBikesList from "@/components/bikes/SupabaseBikesList";
import BikeFilterSidebar from "@/components/bikes/BikeFilterSidebar";
import Footer from "@/components/footer/Footer";
import { Filter } from "lucide-react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Filter Sidebar State
  const [sortBy, setSortBy] = useState("latest");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [maxKm, setMaxKm] = useState(100000);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [yearSort, setYearSort] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleBikeAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setSortBy("latest");
    setMaxPrice(500000);
    setMaxKm(100000);
    setOwnerFilter("all");
    setYearSort("all");
    setSelectedCategory(null);
    setSelectedBrand(null);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 font-sans flex flex-col relative">
      
      {/* 1. Real-time Demo Bikes Navbar */}
      <Navbar
        onSearch={setSearchQuery}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-[1560px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Category Image Filter Cards (Scooters, Motor Bikes, Sports Bikes, Tourers) */}
        <section aria-label="Filter bikes by category">
          <CategoryFilterCards
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        {/* Popular Brands Circular Cards (TVS, Hero, Honda, Royal Enfield, Suzuki, Yamaha, Bajaj, KTM) */}
        <section aria-label="Filter bikes by brand">
          <PopularBrands
            selectedBrand={selectedBrand}
            onBrandSelect={setSelectedBrand}
          />
        </section>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-700">Filter Bikes</span>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>{isMobileFilterOpen ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {/* Mobile Filter Dropdown */}
        {isMobileFilterOpen && (
          <div className="lg:hidden">
            <BikeFilterSidebar
              sortBy={sortBy}
              onSortChange={setSortBy}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              maxKm={maxKm}
              onMaxKmChange={setMaxKm}
              ownerFilter={ownerFilter}
              onOwnerChange={setOwnerFilter}
              yearSort={yearSort}
              onYearSortChange={setYearSort}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Live Supabase Stored Inventory with Left Sticky Filter Sidebar */}
        <section id="inventory" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6 items-start">
            
            {/* Left Sticky Sidebar: 1 column */}
            <aside className="hidden lg:block lg:col-span-1 xl:col-span-1 2xl:col-span-1 sticky top-24 self-start">
              <BikeFilterSidebar
                sortBy={sortBy}
                onSortChange={setSortBy}
                maxPrice={maxPrice}
                onMaxPriceChange={setMaxPrice}
                maxKm={maxKm}
                onMaxKmChange={setMaxKm}
                ownerFilter={ownerFilter}
                onOwnerChange={setOwnerFilter}
                yearSort={yearSort}
                onYearSortChange={setYearSort}
                onResetFilters={handleResetFilters}
              />
            </aside>

            {/* Right Side Bike Grid */}
            <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-4 min-w-0">
              <SupabaseBikesList 
                refreshKey={refreshKey}
                searchQuery={searchQuery}
                locationFilter={selectedLocation}
                categoryFilter={selectedCategory}
                brandFilter={selectedBrand}
                sortBy={sortBy}
                maxPrice={maxPrice}
                maxKm={maxKm}
                ownerFilter={ownerFilter}
                yearSort={yearSort}
              />
            </div>

          </div>
        </section>

      </main>

      {/* 3. Clean Structured Footer */}
      <Footer />

    </div>
  );
}
