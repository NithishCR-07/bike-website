import { createClient } from "../lib/supabase/client";

const BUCKET_NAME = "bike-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/**
 * Uploads a bike image file to the Supabase Storage public bucket.
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<{ publicUrl: string, filePath: string }>} - The public URL and storage path.
 */
export async function uploadBikeImage(file) {
  if (!file) {
    throw new Error("No image file provided.");
  }

  // 1. Validate File Type (MIME type or extension fallback)
  const mimeType = (file.type || "").toLowerCase();
  const fileExtension = (file.name.split(".").pop() || "jpg").toLowerCase();
  const isImageMime = mimeType.startsWith("image/");
  const isImageExt = ["jpg", "jpeg", "png", "webp", "jfif", "heic"].includes(fileExtension);

  if (!isImageMime && !isImageExt) {
    throw new Error("Invalid file format. Please upload a valid JPG, PNG, or WebP image.");
  }

  // 2. Validate File Size (< 5MB)
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5 MB. Please upload a smaller image.");
  }

  const supabase = createClient();

  // 3. Generate a collision-free filename
  const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 9);
  const filePath = `bikes/${Date.now()}-${uniqueId}.${fileExtension === "jpeg" ? "jpg" : fileExtension}`;

  // 4. Upload to Supabase Storage with explicit contentType
  const finalMime = mimeType || `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;
  const { data, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: finalMime,
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase Storage Upload Error:", uploadError);
    if (uploadError.message?.includes("Bucket not found")) {
      throw new Error("Storage bucket 'bike-images' does not exist. Please create a public bucket named 'bike-images' in your Supabase Dashboard under Storage.");
    }
    throw new Error(`Failed to upload image to bucket: ${uploadError.message}`);
  }

  // 5. Retrieve Public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Failed to generate public URL for uploaded image.");
  }

  console.log("Image successfully uploaded to 'bike-images' bucket:", publicUrlData.publicUrl);

  return {
    publicUrl: publicUrlData.publicUrl,
    filePath: data?.path || filePath,
  };
}

/**
 * Deletes an uploaded image from Supabase Storage (used for rollbacks or cleanup).
 * @param {string} filePath - Path of the file in the bucket.
 */
export async function deleteBikeImage(filePath) {
  if (!filePath) return;
  try {
    const supabase = createClient();
    await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  } catch (err) {
    console.warn("Storage cleanup failed:", err);
  }
}
