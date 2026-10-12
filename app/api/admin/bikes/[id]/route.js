import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function sanitizePayloadForPostgres(input) {
  if (!input || typeof input !== "object") return {};
  const payload = {};

  if (input.seller_name !== undefined) payload.seller_name = String(input.seller_name).trim();
  if (input.contact_number !== undefined) {
    let cleanPhone = String(input.contact_number).replace(/\D/g, "");
    if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
      cleanPhone = cleanPhone.slice(2);
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.slice(1);
    }
    if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(0, 10);
    payload.contact_number = cleanPhone;
  }
  if (input.email_address !== undefined) payload.email_address = String(input.email_address).trim().toLowerCase();
  if (input.brand_id !== undefined) payload.brand_id = parseInt(input.brand_id, 10);
  if (input.bike_model !== undefined) payload.bike_model = String(input.bike_model).trim();
  if (input.bike_type_id !== undefined) payload.bike_type_id = parseInt(input.bike_type_id, 10);
  if (input.kilometer_driven !== undefined) payload.kilometer_driven = parseInt(input.kilometer_driven, 10) || 0;
  if (input.number_of_owners !== undefined) payload.number_of_owners = parseInt(input.number_of_owners, 10) || 1;
  if (input.city !== undefined) payload.city = String(input.city).trim();
  if (input.selling_price !== undefined) payload.selling_price = parseFloat(input.selling_price) || 0;
  if (input.bike_image_url !== undefined) payload.bike_image_url = String(input.bike_image_url).trim();
  if (input.status !== undefined) payload.status = String(input.status).trim().toLowerCase();

  const year = input.year_of_model ?? input.registration_year;
  if (year !== undefined) {
    payload.year_of_model = parseInt(year, 10);
  }

  return payload;
}

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const bikeId = params?.id;
    if (!bikeId) {
      return NextResponse.json({ error: "Missing bike ID parameter" }, { status: 400 });
    }

    const rawBody = await request.json();
    const payload = sanitizePayloadForPostgres(rawBody);

    const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (payload.contact_number && !INDIAN_PHONE_REGEX.test(payload.contact_number)) {
      return NextResponse.json(
        { error: "Invalid contact number. Must be a 10-digit Indian phone number starting with 6, 7, 8, or 9." },
        { status: 400 }
      );
    }

    if (payload.email_address && !EMAIL_REGEX.test(payload.email_address)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Update sanitized fields in Postgres
    let { data, error } = await supabase
      .from("bikes")
      .update(payload)
      .eq("id", bikeId)
      .select("*, brands(id, name), bike_types(id, name)");

    if (error) {
      console.warn("Retrying bike update without relation joins...", error.message);
      const retry = await supabase
        .from("bikes")
        .update(payload)
        .eq("id", bikeId)
        .select();

      if (!retry.error) {
        data = retry.data;
        error = null;
      } else {
        error = retry.error;
      }
    }

    if (error) {
      console.error("API PATCH /api/admin/bikes/[id] error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data?.[0] || null, success: true });
  } catch (err) {
    console.error("API PATCH /api/admin/bikes/[id] exception:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update bike status" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  return PATCH(request, context);
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const bikeId = params?.id;
    if (!bikeId) {
      return NextResponse.json({ error: "Missing bike ID parameter" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("bikes")
      .delete()
      .eq("id", bikeId);

    if (error) {
      console.error("API DELETE /api/admin/bikes/[id] error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API DELETE /api/admin/bikes/[id] exception:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete bike" },
      { status: 500 }
    );
  }
}
