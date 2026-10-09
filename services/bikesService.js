import { createClient } from "../lib/supabase/client";

/**
 * Fetches all bike brands for the dropdown.
 */
export async function fetchBrands() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.warn("Could not fetch brands from DB (using defaults):", error.message);
    return [];
  }
  return data || [];
}

/**
 * Fetches all bike body types for the dropdown.
 */
export async function fetchBikeTypes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bike_types")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.warn("Could not fetch bike types from DB (using defaults):", error.message);
    return [];
  }
  return data || [];
}

/**
 * Inserts a new bike listing into Supabase database.
 * Includes intelligent column fallback (registration_year vs year_of_model).
 * @param {Object} bikeData
 */
export function sanitizeBikePayload(input) {
  if (!input || typeof input !== "object") return {};
  const payload = {};

  if (input.seller_name !== undefined) payload.seller_name = String(input.seller_name).trim();
  if (input.contact_number !== undefined) payload.contact_number = String(input.contact_number).trim();
  if (input.email_address !== undefined) {
    payload.email_address = String(input.email_address).trim().toLowerCase();
  } else if (input.seller_name) {
    payload.email_address = `${String(input.seller_name).toLowerCase().replace(/[^a-z0-9]/g, "")}@demobikes.com`;
  } else {
    payload.email_address = "seller@demobikes.com";
  }

  if (input.brand_id !== undefined) payload.brand_id = parseInt(input.brand_id, 10);
  if (input.bike_model !== undefined) payload.bike_model = String(input.bike_model).trim();
  if (input.bike_type_id !== undefined) payload.bike_type_id = parseInt(input.bike_type_id, 10);
  if (input.kilometer_driven !== undefined) payload.kilometer_driven = parseInt(input.kilometer_driven, 10) || 0;
  if (input.number_of_owners !== undefined) payload.number_of_owners = parseInt(input.number_of_owners, 10) || 1;
  if (input.city !== undefined) payload.city = String(input.city).trim();
  if (input.selling_price !== undefined) payload.selling_price = parseFloat(input.selling_price) || 0;
  if (input.bike_image_url !== undefined) payload.bike_image_url = String(input.bike_image_url).trim();
  if (input.status !== undefined) payload.status = String(input.status).trim().toLowerCase() || "available";

  const year = input.year_of_model ?? input.registration_year;
  if (year !== undefined) {
    payload.year_of_model = parseInt(year, 10);
  }

  return payload;
}

/**
 * Inserts a new bike listing into Supabase database.
 * @param {Object} bikeData
 */
export async function createBike(bikeData) {
  // 1. Try server-side API first for maximum reliability & elevated permissions
  try {
    const res = await fetch("/api/admin/bikes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bikeData),
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch (apiErr) {
    console.warn("API route create fallback to direct client:", apiErr);
  }

  // 2. Direct Supabase Client fallback
  const supabase = createClient();
  const payload = sanitizeBikePayload(bikeData);

  let { data, error } = await supabase
    .from("bikes")
    .insert([payload])
    .select("*, brands(id, name), bike_types(id, name)")
    .maybeSingle();

  if (error) {
    const retryRes = await supabase
      .from("bikes")
      .insert([payload])
      .select()
      .maybeSingle();

    if (!retryRes.error) {
      data = retryRes.data;
      error = null;
    } else {
      error = retryRes.error;
    }
  }

  if (error) {
    console.error("Supabase Database Insert Error:", error);
    throw new Error(error.message || "Failed to create bike in database");
  }

  return data;
}

/**
 * Fetches all bikes from Supabase with resilient joins and column normalization.
 */
export async function fetchBikes() {
  const supabase = createClient();
  
  // 1. Try querying with joined brands and bike_types
  let { data, error } = await supabase
    .from("bikes")
    .select(`
      *,
      brands (id, name),
      bike_types (id, name)
    `)
    .order("created_at", { ascending: false });

  // 2. If relationship query fails, fallback to simple select and manual enrichment
  if (error) {
    console.warn("Retrying fetchBikes with simple select fallback:", error.message);
    const simpleRes = await supabase
      .from("bikes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!simpleRes.error) {
      const [brands, types] = await Promise.all([
        fetchBrands().catch(() => []),
        fetchBikeTypes().catch(() => []),
      ]);

      const brandMap = new Map((brands || []).map((b) => [b.id, b]));
      const typeMap = new Map((types || []).map((t) => [t.id, t]));

      data = (simpleRes.data || []).map((b) => ({
        ...b,
        brands: brandMap.get(b.brand_id) || { id: b.brand_id, name: "Motorcycle" },
        bike_types: typeMap.get(b.bike_type_id) || { id: b.bike_type_id, name: "Sports" },
      }));
      error = null;
    } else {
      error = simpleRes.error;
    }
  }

  if (error) {
    console.error("Error fetching bikes from Supabase:", error);
    throw new Error(error.message || "Failed to fetch bikes from database");
  }

  // 3. Normalize all fields so UI components receive standard keys
  const normalizedBikes = (data || []).map((b) => ({
    ...b,
    bike_model: b.bike_model || b.model || "Bike Model",
    seller_name: b.seller_name || b.name || "Seller",
    contact_number: b.contact_number || b.phone || "",
    email_address: b.email_address || b.email || "",
    registration_year: b.registration_year ?? b.year_of_model ?? b.year ?? 2024,
    selling_price: b.selling_price ?? b.price ?? 0,
    kilometer_driven: b.kilometer_driven ?? b.km_driven ?? 0,
    number_of_owners: b.number_of_owners ?? b.owners ?? 1,
    city: b.city || "Chennai",
    bike_image_url: b.bike_image_url || b.image_url || b.image || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    status: b.status || "available",
    brands: b.brands || { id: b.brand_id, name: "Brand" },
    bike_types: b.bike_types || { id: b.bike_type_id, name: "Sports" },
  }));

  return normalizedBikes;
}

/**
 * Fetches a single bike by ID from Supabase.
 * @param {string} id
 */
export async function fetchBikeById(id) {
  if (!id) return null;
  const supabase = createClient();

  // Try querying with joins first
  let { data, error } = await supabase
    .from("bikes")
    .select(`
      *,
      brands (id, name),
      bike_types (id, name)
    `)
    .eq("id", id)
    .single();

  // Fallback to simple select if joins fail
  if (error || !data) {
    const simpleRes = await supabase
      .from("bikes")
      .select("*")
      .eq("id", id)
      .single();

    if (simpleRes.data) {
      const [brands, types] = await Promise.all([
        fetchBrands().catch(() => []),
        fetchBikeTypes().catch(() => []),
      ]);

      const brandMap = new Map((brands || []).map((b) => [b.id, b]));
      const typeMap = new Map((types || []).map((t) => [t.id, t]));

      data = {
        ...simpleRes.data,
        brands: brandMap.get(simpleRes.data.brand_id) || { id: simpleRes.data.brand_id, name: "Motorcycle" },
        bike_types: typeMap.get(simpleRes.data.bike_type_id) || { id: simpleRes.data.bike_type_id, name: "Sports" },
      };
      error = null;
    } else {
      error = simpleRes.error;
    }
  }

  if (error || !data) {
    console.error("Error fetching bike by id:", error);
    return null;
  }

  return {
    ...data,
    bike_model: data.bike_model || data.model || "Bike Model",
    seller_name: data.seller_name || data.name || "Seller",
    contact_number: data.contact_number || data.phone || "",
    email_address: data.email_address || data.email || "",
    registration_year: data.registration_year ?? data.year_of_model ?? data.year ?? 2024,
    selling_price: data.selling_price ?? data.price ?? 0,
    kilometer_driven: data.kilometer_driven ?? data.km_driven ?? 0,
    number_of_owners: data.number_of_owners ?? data.owners ?? 1,
    city: data.city || "Chennai",
    bike_image_url: data.bike_image_url || data.image_url || data.image || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    status: data.status || "available",
    brands: data.brands || { id: data.brand_id, name: "Brand" },
    bike_types: data.bike_types || { id: data.bike_type_id, name: "Sports" },
  };
}

/**
 * Generates an SEO-friendly URL slug from a bike's model/name.
 * Example: "Yamaha MT-15 V2 Metallic Black" -> "yamaha-mt-15-v2-metallic-black"
 */
export function generateBikeSlug(bike) {
  if (!bike) return "";
  const name = bike.bike_model || bike.model || "bike";
  const cleanName = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");
  
  return cleanName || "bike";
}

/**
 * Fetches a bike either by its UUID or by matching its bike name/slug.
 * @param {string} slugOrId
 */
export async function fetchBikeBySlugOrId(slugOrId) {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim().toLowerCase();

  // 1. If it's a UUID, fetch by ID directly
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded);
  if (isUUID) {
    return await fetchBikeById(decoded);
  }

  // 2. Query all bikes to find matching slug
  const allBikes = await fetchBikes();
  
  // Exact slug match
  const matched = allBikes.find((b) => {
    const slug = generateBikeSlug(b);
    return slug === decoded || b.id === decoded;
  });

  if (matched) return matched;

  // Normalized model name match (e.g. "yamaha mt 15")
  const targetWords = decoded.replace(/-/g, " ");
  const fuzzyMatched = allBikes.find((b) => {
    const normModel = (b.bike_model || "").toLowerCase();
    return normModel.includes(targetWords) || targetWords.includes(normModel);
  });

  return fuzzyMatched || allBikes[0] || null;
}

/**
 * Updates an existing bike listing in Supabase database.
 * Uses elevated server-side API route with direct Supabase client fallback.
 * @param {string} bikeId - UUID of the bike to update
 * @param {Object} updateData - Key-value pairs of fields to update
 */
export async function updateBike(bikeId, updateData) {
  if (!bikeId) throw new Error("Bike ID is required for update.");

  // 1. Try server-side API first for maximum reliability & bypassing client RLS blocks
  try {
    const res = await fetch(`/api/admin/bikes/${encodeURIComponent(bikeId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      const json = await res.json();
      return json?.data || { id: bikeId, ...updateData };
    }
  } catch (apiErr) {
    console.warn("API route update fallback to direct client:", apiErr);
  }

  // 2. Direct Supabase Client fallback
  const supabase = createClient();
  const payload = sanitizeBikePayload(updateData);

  let { data, error } = await supabase
    .from("bikes")
    .update(payload)
    .eq("id", bikeId)
    .select();

  if (error) {
    console.error("Supabase Database Update Error:", error);
    throw new Error(error.message || "Failed to update bike in database");
  }

  return data?.[0] || { id: bikeId, ...updateData };
}

/**
 * Toggles or updates the status of a bike (e.g. 'available', 'sold', 'reserved').
 * @param {string} bikeId
 * @param {'available' | 'sold' | 'reserved'} status
 */
export async function toggleBikeStatus(bikeId, status) {
  if (!bikeId) throw new Error("Bike ID is required.");
  if (!["available", "sold", "reserved"].includes(status)) {
    throw new Error("Invalid status. Must be available, sold, or reserved.");
  }
  return await updateBike(bikeId, { status });
}

/**
 * Permanently deletes a bike listing from Supabase database.
 * @param {string} bikeId - UUID of the bike to delete
 */
export async function deleteBike(bikeId) {
  if (!bikeId) throw new Error("Bike ID is required for deletion.");

  // 1. Try server-side API first
  try {
    const res = await fetch(`/api/admin/bikes/${encodeURIComponent(bikeId)}`, {
      method: "DELETE",
    });
    if (res.ok) return true;
  } catch (apiErr) {
    console.warn("API route delete fallback to direct client:", apiErr);
  }

  // 2. Direct Supabase Client fallback
  const supabase = createClient();
  const { error } = await supabase
    .from("bikes")
    .delete()
    .eq("id", bikeId);

  if (error) {
    console.error("Supabase Database Delete Error:", error);
    throw new Error(error.message || "Failed to delete bike from database");
  }

  return true;
}

