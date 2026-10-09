"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, PlusCircle } from "lucide-react";
import { fetchBikes, toggleBikeStatus } from "@/services/bikesService";
import { createClient } from "@/lib/supabase/client";
import { isAdminAuthenticated } from "@/services/adminAuthService";

import AdminAuthGate from "@/components/admin/AdminAuthGate";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminBikesTable from "@/components/admin/AdminBikesTable";
import EditBikeModal from "@/components/admin/EditBikeModal";
import DeleteBikeModal from "@/components/admin/DeleteBikeModal";
import AddBikeModal from "@/components/bikes/AddBikeModal";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Data State
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState(null);
  const [deletingBike, setDeletingBike] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Check initial admin session
  useEffect(() => {
    async function checkAuth() {
      try {
        const authStatus = await isAdminAuthenticated();
        setIsAuthenticated(Boolean(authStatus));
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch all bikes
  const loadBikes = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsRefreshing(true);
      setError(null);
      const data = await fetchBikes();
      setBikes(data || []);
    } catch (err) {
      console.error("Admin fetch bikes error:", err);
      setError(err.message || "Failed to load bike listings from database.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load bikes on auth success
  useEffect(() => {
    if (isAuthenticated) {
      loadBikes(false);
    }
  }, [isAuthenticated, loadBikes]);

  // Real-time Supabase Subscription for Admin Live Sync
  useEffect(() => {
    if (!isAuthenticated) return;

    const supabase = createClient();

    const channel = supabase
      .channel("admin-realtime-bikes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bikes" },
        (payload) => {
          console.log("⚡ Real-time database event in Admin Panel:", payload.eventType);
          loadBikes(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, loadBikes]);

  // Handle inline quick status toggle
  const handleToggleStatus = async (bikeId, newStatus) => {
    setUpdatingStatusId(bikeId);
    try {
      // Optimistic update
      setBikes((prev) =>
        prev.map((b) => (b.id === bikeId ? { ...b, status: newStatus } : b))
      );

      await toggleBikeStatus(bikeId, newStatus);
    } catch (err) {
      console.error("Status toggle error:", err);
      alert(`Failed to update status: ${err.message}`);
      loadBikes(false); // Revert on failure
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handlers for CRUD events
  const handleBikeAdded = () => {
    loadBikes(false);
  };

  const handleBikeUpdated = () => {
    loadBikes(false);
  };

  const handleBikeDeleted = (deletedId) => {
    setBikes((prev) => prev.filter((b) => b.id !== deletedId));
  };

  // 1. Loading Initial Auth Check
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-800">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // 2. Unauthenticated: Show Secure Passkey Screen
  if (!isAuthenticated) {
    return (
      <AdminAuthGate onAuthenticated={() => setIsAuthenticated(true)} />
    );
  }

  // 3. Authenticated: Render Full Admin Console
  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-900 font-sans flex flex-col">
      
      {/* Admin Topbar */}
      <AdminHeader
        onRefresh={() => loadBikes(true)}
        isRefreshing={isRefreshing}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-[1560px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Clean Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight font-display">
              Bike Inventory Management
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Post New Bike</span>
          </button>
        </div>

        {/* Real-time KPI Stats Cards */}
        <section aria-label="Inventory Metrics">
          <AdminStatsCards bikes={bikes} />
        </section>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadBikes(true)}
              className="underline font-bold text-red-800 hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Inventory Data Table */}
        <section aria-label="Inventory Management Table">
          {loading ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-sm font-bold text-slate-700">Loading live inventory from Supabase...</p>
            </div>
          ) : (
            <AdminBikesTable
              bikes={bikes}
              onEditBike={(bike) => setEditingBike(bike)}
              onDeleteBike={(bike) => setDeletingBike(bike)}
              onToggleStatus={handleToggleStatus}
              updatingStatusId={updatingStatusId}
            />
          )}
        </section>

      </main>

      {/* Add Bike Modal */}
      <AddBikeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBikeAdded={handleBikeAdded}
      />

      {/* Edit Bike Modal */}
      <EditBikeModal
        isOpen={Boolean(editingBike)}
        bike={editingBike}
        onClose={() => setEditingBike(null)}
        onBikeUpdated={handleBikeUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBikeModal
        isOpen={Boolean(deletingBike)}
        bike={deletingBike}
        onClose={() => setDeletingBike(null)}
        onBikeDeleted={handleBikeDeleted}
      />

    </div>
  );
}
