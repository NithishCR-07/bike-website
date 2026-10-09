"use client";

import { useState, useEffect, useRef } from "react";
import { 
  X, 
  ChevronDown, 
  Loader2, 
  Check, 
  AlertCircle,
  Bike,
  Tag,
  Calendar,
  Gauge,
  User,
  Phone,
  Mail,
  MapPin,
  Upload
} from "lucide-react";
import { updateBike, fetchBrands, fetchBikeTypes } from "@/services/bikesService";
import { uploadBikeImage } from "@/services/storageService";

export default function EditBikeModal({ isOpen, bike, onClose, onBikeUpdated }) {
  const [formData, setFormData] = useState({});
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  
  // Real-time Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploadingRealtime, setIsUploadingRealtime] = useState(false);
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form data when bike is opened
  useEffect(() => {
    if (bike) {
      setFormData({
        brand_id: bike.brand_id || bike.brands?.id || "",
        bike_model: bike.bike_model || "",
        description: bike.description || "",
        bike_type_id: bike.bike_type_id || bike.bike_types?.id || "",
        registration_year: bike.registration_year || bike.year_of_model || 2024,
        kilometer_driven: bike.kilometer_driven ?? 0,
        number_of_owners: bike.number_of_owners || 1,
        city: bike.city || "Chennai",
        selling_price: bike.selling_price || 0,
        seller_name: bike.seller_name || "",
        contact_number: bike.contact_number || "",
        email_address: bike.email_address || "",
        status: bike.status || "available",
        bike_image_url: bike.bike_image_url || "",
      });
      setImagePreview(bike.bike_image_url || "");
      setUploadedImageUrl(bike.bike_image_url || "");
      setSelectedFile(null);
      setError(null);
      setSuccess(false);
    }
  }, [bike]);

  // Load brands and bike types
  useEffect(() => {
    if (isOpen) {
      fetchBrands().then(setBrands).catch(console.warn);
      fetchBikeTypes().then(setTypes).catch(console.warn);
    }
  }, [isOpen]);

  if (!isOpen || !bike) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Real-time Upload on file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB. Please choose a smaller image.");
      return;
    }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setIsUploadingRealtime(true);

    try {
      const res = await uploadBikeImage(file);
      if (res?.publicUrl) {
        setUploadedImageUrl(res.publicUrl);
        setFormData((prev) => ({ ...prev, bike_image_url: res.publicUrl }));
      }
    } catch (uploadErr) {
      console.error("Real-time upload failed:", uploadErr);
      setError("Failed to upload image. You can still retry.");
    } finally {
      setIsUploadingRealtime(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bike_model?.trim()) {
      setError("Please enter the Bike Model name.");
      return;
    }
    if (!formData.selling_price) {
      setError("Please enter the Selling Price.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalImageUrl = uploadedImageUrl || formData.bike_image_url;

      if (selectedFile && !uploadedImageUrl) {
        setIsUploadingRealtime(true);
        const uploadResult = await uploadBikeImage(selectedFile);
        finalImageUrl = uploadResult.publicUrl;
        setIsUploadingRealtime(false);
      }

      const payload = {
        ...formData,
        bike_image_url: finalImageUrl,
      };

      const updated = await updateBike(bike.id, payload);
      setSuccess(true);
      
      setTimeout(() => {
        if (onBikeUpdated) onBikeUpdated(updated);
        onClose();
      }, 500);

    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update bike. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-sans text-slate-900">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header Matching Exact Theme */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0b2d38] flex items-center justify-center p-2.5 shadow-sm border border-slate-700/30">
              <Bike className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-[#0b2d38] font-display">
                DEMO <span className="text-[#007e22]">BIKES</span>
              </div>
              <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight">
                Edit Bike Specifications
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* 2. Form Body with Exact Theme Inputs */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[#007e22] text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0 text-[#007e22]" />
              <span>Listing updated successfully!</span>
            </div>
          )}

          {/* Bike Model / Item Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Item Name / Model
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.bike_model || ""}
                onChange={(e) => handleInputChange("bike_model", e.target.value)}
                placeholder="e.g. Royal Enfield Hunter 350"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
              />
            </div>
          </div>

          {/* Brand & Bike Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Brand
              </label>
              <div className="relative">
                <select
                  value={formData.brand_id || ""}
                  onChange={(e) => handleInputChange("brand_id", e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] appearance-none cursor-pointer transition-all"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Body Type / Style
              </label>
              <div className="relative">
                <select
                  value={formData.bike_type_id || ""}
                  onChange={(e) => handleInputChange("bike_type_id", e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] appearance-none cursor-pointer transition-all"
                >
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Selling Price & Registration Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Selling Price (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="text-sm font-bold">₹</span>
                </div>
                <input
                  type="number"
                  value={formData.selling_price || ""}
                  onChange={(e) => handleInputChange("selling_price", e.target.value)}
                  placeholder="150000"
                  required
                  min="1000"
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Registration Year
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  value={formData.registration_year || ""}
                  onChange={(e) => handleInputChange("registration_year", e.target.value)}
                  min="1990"
                  max="2030"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>
          </div>

          {/* KM Driven & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Kilometers Driven
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  value={formData.kilometer_driven ?? ""}
                  onChange={(e) => handleInputChange("kilometer_driven", e.target.value)}
                  placeholder="KM Driven"
                  min="0"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                City / Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Seller Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Seller Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.seller_name || ""}
                  onChange={(e) => handleInputChange("seller_name", e.target.value)}
                  placeholder="Seller Name"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={formData.contact_number || ""}
                  onChange={(e) => handleInputChange("contact_number", e.target.value)}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Address & Status (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email_address || ""}
                  onChange={(e) => handleInputChange("email_address", e.target.value)}
                  placeholder="e.g. seller@demobikes.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Listing Status
              </label>
              <div className="relative">
                <select
                  value={formData.status || "available"}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] appearance-none cursor-pointer transition-all"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold Out</option>
                  <option value="reserved">Reserved</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Bike Photo Upload */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-slate-700">
              Bike Photo
            </label>
            
            {imagePreview ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4fc] border border-slate-200">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-12 h-10 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-800 block truncate max-w-[220px]">
                      {selectedFile?.name || "Current Bike Photo"}
                    </span>
                    {isUploadingRealtime ? (
                      <span className="text-[11px] text-[#007e22] font-semibold flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#007e22] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Uploaded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#007e22] hover:underline font-semibold cursor-pointer px-2 py-1"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#eff4fc] hover:bg-[#e4edf9] border border-dashed border-slate-300 hover:border-[#007e22] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center gap-1.5"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-2xs">
                  <Upload className="w-4 h-4 text-[#007e22]" />
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Drop replacement photo or <strong className="text-[#007e22] font-bold underline">browse</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  PNG, JPG, WebP up to 5MB
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 3. Bottom Action Buttons matching Zoho Green Button */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || isUploadingRealtime}
              className="px-6 py-2.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isUploadingRealtime ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Image...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
