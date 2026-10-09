import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function sanitizePayloadForPostgres(input) {
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

export async function POST(request) {
  try {
    const rawBody = await request.json();
    const payload = sanitizePayloadForPostgres(rawBody);

    const supabase = createAdminClient();

    let { data, error } = await supabase
      .from("bikes")
      .insert([payload])
      .select("*, brands(id, name), bike_types(id, name)");

    if (error) {
      console.warn("Retrying bike insert without joins...", error.message);
      const retry = await supabase
        .from("bikes")
        .insert([payload])
        .select();

      if (!retry.error) {
        data = retry.data;
        error = null;
      } else {
        error = retry.error;
      }
    }

    if (error) {
      console.error("API POST /api/admin/bikes error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data?.[0] || null, success: true });
  } catch (err) {
    console.error("API POST /api/admin/bikes exception:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create bike listing" },
      { status: 500 }
    );
  }
}
