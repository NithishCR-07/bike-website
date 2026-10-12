"use client";

import { useState } from "react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  Bike
} from "lucide-react";
import { loginAdminWithEmail } from "@/services/adminAuthService";

export default function AdminAuthGate({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await loginAdminWithEmail(email, password);
      onAuthenticated();
    } catch (err) {
      setError(err?.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f7] flex items-center justify-center p-4 sm:p-6 font-sans select-none">
      
      {/* Centered Zoho-style White Card */}
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/80 p-8 sm:p-12 text-slate-900 space-y-7">
        
        {/* Top Logo: Website Official Icon & Title */}
        <div className="text-center space-y-3">
          
          {/* Official Demo Bikes Emblem */}
          <div className="w-12 h-12 rounded-2xl bg-[#0b2d38] flex items-center justify-center p-2.5 shadow-sm border border-slate-700/30 mx-auto">
            <Bike className="w-6 h-6 text-white stroke-[2.2]" />
          </div>

          <div className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2d38] font-display">
            DEMO <span className="text-emerald-600">BIKES</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight font-sans">
            Welcome Admin!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-xs mx-auto -mt-1">
            Sign in to access your inventory management console.
          </p>
        </div>

        {/* Clean Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake shadow-xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="admin@gmail.com"
                autoFocus
                autoComplete="email"
                required
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none transition-all ${
                  error
                    ? "border border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                    : "bg-white border border-slate-300 focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22]"
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none transition-all ${
                  error
                    ? "border border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                    : "bg-white border border-slate-300 focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Zoho-style Signature Green Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-[6px] bg-[#007e22] hover:bg-[#006e1e] text-white font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Access Admin Console</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
