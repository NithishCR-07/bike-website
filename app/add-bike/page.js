"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import AddBikeForm from "@/components/bikes/AddBikeForm";
import SupabaseBikesList from "@/components/bikes/SupabaseBikesList";
// jfslkdfjs
export default function AddBikePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBikeAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase DB & Storage Connected</span>
          </div>
        </div>

        {/* The Add Bike Form */}
        <AddBikeForm onBikeAdded={handleBikeAdded} />

        {/* Live List of Bikes from Supabase */}
        <SupabaseBikesList refreshKey={refreshKey} />

      </div>
    </div>
  );
}
