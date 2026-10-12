"use client";

import { Bike } from "lucide-react";

export default function BikeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 font-sans pb-20 select-none">
      
      {/* 1. Header / Navigation Skeleton */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 rounded-lg bg-slate-200/80 animate-pulse" />
            <div className="h-6 w-28 rounded-md bg-slate-200/60 animate-pulse hidden sm:block" />
          </div>
          <div className="h-8 w-20 rounded-lg bg-slate-200/80 animate-pulse" />
        </div>
      </header>

      {/* 2. Main Centered Layout Skeleton */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 animate-pulse">
        
        {/* Centered Bike Hero Image Placeholder */}
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-3xl aspect-[16/10] bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/90 flex items-center justify-center">
            <div className="w-full h-full bg-slate-200/70 flex items-center justify-center">
              <Bike className="w-16 h-16 text-slate-300/80 stroke-[1.2]" />
            </div>
            
            {/* Top-left Brand Pill */}
            <div className="absolute top-4 left-4 h-6 w-20 bg-slate-300/90 rounded-md" />

            {/* Top-right Status Pill */}
            <div className="absolute top-4 right-4 h-6 w-20 bg-emerald-200/80 rounded-md" />
          </div>
        </div>

        {/* Centered Title, Price & Primary Info Skeleton */}
        <div className="text-center space-y-3.5">
          {/* Tag Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-6 w-24 bg-emerald-100 rounded-full" />
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
          </div>

          {/* Model Title */}
          <div className="h-9 sm:h-10 w-72 sm:w-96 max-w-full mx-auto bg-slate-300/80 rounded-xl" />

          {/* Price & Location */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-8 sm:h-9 w-36 bg-slate-300/80 rounded-lg" />
            <div className="h-6 w-0.5 bg-slate-200" />
            <div className="h-8 w-28 bg-slate-200 rounded-lg" />
          </div>
        </div>

        {/* Action Buttons Skeleton (WhatsApp, Location, Call) */}
        <div className="max-w-xl mx-auto w-full grid grid-cols-3 gap-3">
          <div className="h-11 rounded-lg bg-[#25D366]/20 border border-[#25D366]/30" />
          <div className="h-11 rounded-lg bg-white border border-slate-200" />
          <div className="h-11 rounded-lg bg-[#007e22]/20 border border-[#007e22]/30" />
        </div>

        {/* Specifications & Details Card Skeleton */}
        <div className="max-w-3xl mx-auto w-full bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
          
          {/* Section Header */}
          <div className="h-6 w-44 bg-slate-200 rounded-md" />

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            {[
              { labelW: "w-16", valW: "w-24" },
              { labelW: "w-24", valW: "w-32" },
              { labelW: "w-28", valW: "w-16" },
              { labelW: "w-20", valW: "w-24" },
              { labelW: "w-32", valW: "w-20" },
              { labelW: "w-28", valW: "w-20" },
              { labelW: "w-24", valW: "w-24" },
              { labelW: "w-24", valW: "w-28" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className={`h-4 ${item.labelW} bg-slate-100 rounded`} />
                <div className={`h-4 ${item.valW} bg-slate-200 rounded`} />
              </div>
            ))}
          </div>

          {/* Seller Information Section Skeleton */}
          <div className="pt-4 border-t border-slate-100">
            <div className="h-5 w-36 bg-slate-200 rounded-md mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              {[
                { labelW: "w-24", valW: "w-28" },
                { labelW: "w-28", valW: "w-24" },
                { labelW: "w-24", valW: "w-36" },
                { labelW: "w-20", valW: "w-24" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div className={`h-4 ${item.labelW} bg-slate-100 rounded`} />
                  <div className={`h-4 ${item.valW} bg-slate-200 rounded`} />
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
