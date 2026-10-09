"use client";

import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  HeartHandshake, 
  Award, 
  Sparkles,
  Search,
  MessageCircle
} from "lucide-react";

export default function AboutView() {
  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 font-sans flex flex-col justify-between">
      
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Main About Content */}
      <main className="flex-1 max-w-[1560px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#007e22] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#007e22]" />
            <span>Tamil Nadu's Most Trusted Bike Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0b2d38] tracking-tight font-display leading-tight">
            Connecting Bike Lovers Across <span className="text-[#007e22]">Tamil Nadu</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Demo Bikes is built with a singular vision: providing a seamless, transparent, and direct platform for buying and selling quality verified pre-owned two-wheelers without hidden charges or middleman markups.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/#inventory"
              className="px-6 py-3 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white text-sm font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Browse Bikes</span>
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Satisfied Riders", value: "5,000+", icon: Users },
            { label: "Verified Listings", value: "100%", icon: ShieldCheck },
            { label: "Cities in TN", value: "15+", icon: MapPin },
            { label: "Direct Dealer Connect", value: "Instant", icon: Zap },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 text-center space-y-2 hover:border-[#007e22]/40 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#007e22] mx-auto flex items-center justify-center mb-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0b2d38] font-stylized">
                  {stat.value}
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        {/* Our Mission & Values */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 sm:p-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-[#007e22]" />
              <span>Our Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0b2d38] font-display tracking-tight">
              Honest Two-Wheeler Trading, Done Right
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We empower buyers with transparent pricing, comprehensive mechanical specifications (Model Year, KM Driven, Owner History, City Location), and authentic high-resolution images so you always make an informed choice.
            </p>

            <ul className="space-y-3 text-sm text-slate-700 font-medium">
              {[
                "100% Direct phone call & WhatsApp connectivity with verified dealers",
                "Authentic kilometer and registration year records",
                "Comprehensive category filtering: Scooters, Motor Bikes, Sports, Tourers",
                "Real-time database inventory synced instantly with Supabase",
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007e22] flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0b2d38] text-white rounded-2xl p-8 sm:p-10 shadow-sm space-y-5 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Transparent & Free for Buyers
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you are searching for a commuter scooter like Jupiter or Dio, or an iconic Royal Enfield Classic 350, Demo Bikes gives you complete freedom to call sellers directly without platform commission.
              </p>

              <div className="pt-2">
                <Link
                  href="/#inventory"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Explore Available Bikes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex items-center gap-5 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#007e22] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0b2d38] font-display">
                  Serving All Major Tamil Nadu Hubs
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Chennai • Coimbatore • Madurai • Salem • Trichy • Dharmapuri • Tirunelveli • Erode • Vellore
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Support Banner */}
        <section className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-8 sm:p-10 text-center space-y-4 max-w-4xl mx-auto shadow-xs">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0b2d38] font-display">
            Need Help or Have a Question?
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Our support team is always ready to assist you with inquiries, dealer partnerships, or vehicle listings.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <a
              href="mailto:support@demobikes.com"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>support@demobikes.com</span>
            </a>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <Footer className="mt-16" />

    </div>
  );
}
