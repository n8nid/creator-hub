import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: List creator (profile) yang sudah approved
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, user_id, name, bio, location, skills, experience_level, profile_image, status"
    )
    .eq("status", "approved")
    .order("name", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ creators: data });
}
