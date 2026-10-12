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
  DollarSign,
  Upload,
  Layers
} from "lucide-react";
import { fetchBrands, fetchBikeTypes, createBike } from "@/services/bikesService";
import { uploadBikeImage } from "@/services/storageService";

export default function AddBikeForm({ onBikeAdded, onClose }) {
  // Lookups
  const [brands, setBrands] = useState([]);
  const [bikeTypes, setBikeTypes] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    bike_model: "",
    description: "",
    brand_id: "",
    bike_type_id: "",
    selling_price: "",
    registration_year: "2024",
    kilometer_driven: "",
    number_of_owners: "1",
    city: "Chennai",
    seller_name: "",
    contact_number: "",
    email_address: "",
    status: "available",
  });

  // Real-time Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploadingRealtime, setIsUploadingRealtime] = useState(false);
  const fileInputRef = useRef(null);

  // Submission States
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load brands and types from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingLookups(true);
        const [brandsData, typesData] = await Promise.all([
          fetchBrands().catch(() => []),
          fetchBikeTypes().catch(() => []),
        ]);

        const defaultBrands = [
          { id: 1, name: "Royal Enfield" },
          { id: 2, name: "Yamaha" },
          { id: 3, name: "KTM" },
          { id: 4, name: "Honda" },
          { id: 5, name: "Bajaj" },
          { id: 6, name: "TVS" },
          { id: 7, name: "Kawasaki" },
        ];

        const defaultTypes = [
          { id: 1, name: "Cruiser" },
          { id: 2, name: "Sports" },
          { id: 3, name: "Street / Naked" },
          { id: 4, name: "Scooter" },
          { id: 5, name: "Cafe Racer" },
        ];

        const finalBrands = brandsData?.length ? brandsData : defaultBrands;
        const finalTypes = typesData?.length ? typesData : defaultTypes;

        setBrands(finalBrands);
        setBikeTypes(finalTypes);

        if (finalBrands[0]) setFormData((p) => ({ ...p, brand_id: String(finalBrands[0].id) }));
        if (finalTypes[0]) setFormData((p) => ({ ...p, bike_type_id: String(finalTypes[0].id) }));
      } finally {
        setLoadingLookups(false);
      }
    }
    loadData();
  }, []);

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length === 12 && val.startsWith("91")) {
      val = val.slice(2);
    } else if (val.length === 11 && val.startsWith("0")) {
      val = val.slice(1);
    }
    if (val.length > 10) {
      val = val.slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, contact_number: val }));
  };

  const handleEmailChange = (e) => {
    setFormData((prev) => ({ ...prev, email_address: e.target.value.trim() }));
    if (emailError) setEmailError(null);
    if (error) setError(null);
  };

  // Real-time Upload on file selection
  const handleFileSelect = async (file) => {
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
    if (!formData.bike_model.trim()) {
      setError("Please enter the Bike Model name.");
      return;
    }
    if (!formData.selling_price) {
      setError("Please enter the Selling Price.");
      return;
    }
    if (!formData.seller_name.trim()) {
      setError("Please provide the Seller Name.");
      return;
    }

    // Validate Indian Phone Number
    const cleanPhone = (formData.contact_number || "").trim();
    if (!cleanPhone) {
      setError("Please provide a Contact Phone Number.");
      return;
    }
    if (!INDIAN_PHONE_REGEX.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.");
      return;
    }

    // Validate Email Address (if provided)
    const cleanEmail = (formData.email_address || "").trim();
    if (cleanEmail && !EMAIL_REGEX.test(cleanEmail)) {
      const msg = "Invalid email address";
      setError(msg);
      setEmailError(true);
      return;
    }
    setEmailError(false);

    setSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = uploadedImageUrl || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80";

      if (selectedFile && !uploadedImageUrl) {
        setIsUploadingRealtime(true);
        const res = await uploadBikeImage(selectedFile);
        finalImageUrl = res.publicUrl;
        setUploadedImageUrl(res.publicUrl);
        setIsUploadingRealtime(false);
      }

      const payload = {
        seller_name: formData.seller_name.trim(),
        contact_number: formData.contact_number.trim(),
        email_address: formData.email_address.trim() || `${formData.seller_name.toLowerCase().replace(/\s+/g, "")}@demobikes.com`,
        brand_id: parseInt(formData.brand_id, 10),
        bike_model: formData.bike_model.trim(),
        bike_type_id: parseInt(formData.bike_type_id, 10),
        registration_year: parseInt(formData.registration_year, 10) || 2024,
        kilometer_driven: parseInt(formData.kilometer_driven, 10) || 0,
        number_of_owners: parseInt(formData.number_of_owners, 10) || 1,
        city: formData.city.trim() || "Chennai",
        selling_price: parseFloat(formData.selling_price),
        bike_image_url: finalImageUrl,
        status: formData.status || "available",
      };

      const newBike = await createBike(payload);
      setSuccess(true);

      setTimeout(() => {
        if (onBikeAdded) onBikeAdded(newBike);
        if (onClose) onClose();
      }, 500);

    } catch (err) {
      console.error("Create bike error:", err);
      setError(err.message || "Failed to create bike listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/80 w-full max-w-2xl overflow-hidden font-sans text-slate-900">
      
      {/* 1. Top Header Matching Exact Theme */}
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
              Post New Bike
            </h2>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>

      {/* 2. Form Body with Exact Theme Inputs */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[78vh] overflow-y-auto">
        
        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[#007e22] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0 text-[#007e22]" />
            <span>Bike published successfully!</span>
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
              value={formData.bike_model}
              onChange={(e) => handleInputChange("bike_model", e.target.value)}
              placeholder="e.g. Royal Enfield Hunter 350"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
            />
          </div>
        </div>

        {/* Brand & Bike Type (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Brand
            </label>
            <div className="relative">
              <select
                value={formData.brand_id}
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
                value={formData.bike_type_id}
                onChange={(e) => handleInputChange("bike_type_id", e.target.value)}
                className="w-full px-3 pr-8 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] appearance-none cursor-pointer transition-all"
              >
                {bikeTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Selling Price & Registration Year (2 Columns) */}
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
                value={formData.selling_price}
                onChange={(e) => handleInputChange("selling_price", e.target.value)}
                placeholder="e.g. 145000"
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
                value={formData.registration_year}
                onChange={(e) => handleInputChange("registration_year", e.target.value)}
                min="1990"
                max="2030"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
              />
            </div>
          </div>
        </div>

        {/* KM Driven & City (2 Columns) */}
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
                value={formData.kilometer_driven}
                onChange={(e) => handleInputChange("kilometer_driven", e.target.value)}
                placeholder="e.g. 12000"
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
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g. Chennai"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Seller Name & Phone (2 Columns) */}
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
                value={formData.seller_name}
                onChange={(e) => handleInputChange("seller_name", e.target.value)}
                placeholder="e.g. Sanjeevan"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              {formData.contact_number ? (
                <span
                  className={`text-[10px] font-semibold ${
                    INDIAN_PHONE_REGEX.test(formData.contact_number)
                      ? "text-[#007e22]"
                      : "text-amber-600"
                  }`}
                >
                  {formData.contact_number.length}/10 digits
                </span>
              ) : null}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={formData.contact_number}
                onChange={handlePhoneChange}
                placeholder="10-digit mobile (e.g. 9876543210)"
                maxLength={10}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#eff4fc] border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22] transition-all"
              />
            </div>
            {formData.contact_number && !INDIAN_PHONE_REGEX.test(formData.contact_number) && formData.contact_number.length === 10 && (
              <p className="text-[11px] text-red-500 font-medium">Must start with 6, 7, 8, or 9</p>
            )}
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
                value={formData.email_address}
                onChange={handleEmailChange}
                placeholder="e.g. seller@demobikes.com"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none transition-all ${
                  emailError
                    ? "bg-red-50/50 border border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
                    : "bg-[#eff4fc] border border-slate-200 focus:bg-white focus:border-[#007e22] focus:ring-1 focus:ring-[#007e22]"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Listing Status
            </label>
            <div className="relative">
              <select
                value={formData.status}
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
                    {selectedFile?.name || "Uploaded Photo"}
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
                  Change
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setImagePreview(null);
                    setUploadedImageUrl("");
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
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
                Drop image or <strong className="text-[#007e22] font-bold underline">browse</strong>
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
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
          />
        </div>

        {/* 3. Bottom Action Buttons matching Zoho Green Button */}
        <div className="pt-3 flex items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={submitting || isUploadingRealtime}
            className="px-6 py-2.5 rounded-lg bg-[#007e22] hover:bg-[#006e1e] text-white font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : isUploadingRealtime ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Image...</span>
              </>
            ) : (
              <span>Post Bike</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
