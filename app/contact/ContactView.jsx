"use client";

import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Bike
} from "lucide-react";

export default function ContactView() {
  const contactCards = [
    {
      icon: Phone,
      title: "Phone Support",
      value: "+91 XXXXXXXXXX",
      description: "Direct call & WhatsApp support line",
      isLink: false,
    },
    {
      icon: Mail,
      title: "Email Support",
      value: "support@demobikes.com",
      description: "Fast responses within 24 hours",
      isLink: true,
      href: "mailto:support@demobikes.com",
    },
    {
      icon: MapPin,
      title: "Head Office",
      value: "Chennai, Tamil Nadu, India",
      description: "Serving all 38 districts across Tamil Nadu",
      isLink: false,
    },
    {
      icon: Clock,
      title: "Operating Hours",
      value: "9:00 AM – 8:00 PM",
      description: "Monday through Saturday (Sunday Closed)",
      isLink: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 font-sans flex flex-col justify-between">
      
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Main Contact Content */}
      <main className="flex-1 max-w-[1560px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#007e22] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#007e22]" />
            <span>Support & Assistance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0b2d38] tracking-tight font-display">
            Contact <span className="text-[#007e22]">Demo Bikes</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Have inquiries regarding vehicle listings or marketplace assistance? Here is how you can connect with us.
          </p>
        </section>

        {/* 4 Clean Contact Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {contactCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4 hover:border-[#007e22]/50 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#eff4fc] text-[#007e22] flex items-center justify-center border border-slate-200/60 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      {item.title}
                    </span>

                    {item.isLink ? (
                      <a
                        href={item.href}
                        className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#007e22] transition-colors mt-0.5 block hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  {item.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Direct Dealer Connect Section (Clean Light Theme) */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-8 sm:p-10 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#007e22] flex-shrink-0">
              <Headphones className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4fc] text-slate-700 text-xs font-bold">
                <Bike className="w-3.5 h-3.5 text-[#007e22]" />
                <span>Zero Middleman Marketplace</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#0b2d38] font-display tracking-tight">
                Direct Dealer & Seller Connect
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Every bike listing on Demo Bikes includes verified dealer contact numbers and one-click WhatsApp access so you can discuss vehicle details directly with zero commission.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-[#007e22] flex-shrink-0" />
              <span>Verified pre-owned motorcycles and scooters across Tamil Nadu</span>
            </div>

            <Link
              href="/#inventory"
              className="px-6 py-2.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer flex-shrink-0"
            >
              <span>Browse Bike Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <Footer className="mt-16" />

    </div>
  );
}
