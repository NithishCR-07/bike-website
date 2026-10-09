"use client";

import { Bike, CheckCircle2, ShoppingBag, IndianRupee } from "lucide-react";

export default function AdminStatsCards({ bikes = [] }) {
  const totalBikes = bikes.length;
  const availableBikes = bikes.filter((b) => (b.status || "available") === "available").length;
  const soldBikes = bikes.filter((b) => b.status === "sold").length;
  
  const totalValue = bikes
    .filter((b) => (b.status || "available") === "available")
    .reduce((sum, b) => sum + (Number(b.selling_price) || 0), 0);

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const stats = [
    {
      label: "Total Bikes",
      value: totalBikes,
      icon: Bike,
      iconColor: "text-slate-700",
      iconBg: "bg-slate-100",
    },
    {
      label: "Active and Available",
      value: availableBikes,
      icon: CheckCircle2,
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Sold",
      value: soldBikes,
      icon: ShoppingBag,
      iconColor: "text-amber-700",
      iconBg: "bg-amber-50",
    },
    {
      label: "Total Cost",
      value: formatPrice(totalValue),
      icon: IndianRupee,
      iconColor: "text-teal-700",
      iconBg: "bg-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                {stat.value}
              </div>
            </div>

            <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${stat.iconColor} stroke-[2.2]`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
