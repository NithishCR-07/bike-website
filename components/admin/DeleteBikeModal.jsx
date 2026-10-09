"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { deleteBike } from "@/services/bikesService";

export default function DeleteBikeModal({ isOpen, bike, onClose, onBikeDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !bike) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await deleteBike(bike.id);
      if (onBikeDeleted) onBikeDeleted(bike.id);
      onClose();
    } catch (err) {
      console.error("Delete bike error:", err);
      setError(err.message || "Failed to delete bike. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans text-slate-900 select-none">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer absolute top-4 right-4"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Warning Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 block">
              Permanent Deletion
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Delete Bike Listing?
            </h3>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Target Bike Preview Card */}
        <div className="p-3.5 rounded-xl bg-[#eff4fc] border border-slate-200 flex items-center gap-3.5">
          <img
            src={bike.bike_image_url}
            alt={bike.bike_model}
            className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">
              {bike.bike_model}
            </p>
            <p className="text-xs font-black text-[#007e22]">
              {formatPrice(bike.selling_price)}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {bike.registration_year || bike.year_of_model} • {bike.city || "Tamil Nadu"} • Seller: {bike.seller_name}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to delete this listing from the database? This action <strong className="text-red-700 font-semibold">cannot be undone</strong> and will immediately remove the bike from the live market.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
