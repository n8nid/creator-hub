import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Detail creator (profile) yang sudah approved dan sudah di-approve sebagai creator
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const profileId = params.id;
  // Ambil profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, user_id, name, bio, location, skills, experience_level, profile_image, status"
    )
    .eq("id", profileId)
    .eq("status", "approved")
    .single();
  if (profileError || !profile) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }
  // Cek apakah user_id ada di creator_applications yang statusnya approved
  const { data: creatorApp } = await supabase
    .from("creator_applications")
    .select("id")
    .eq("user_id", profile.user_id)
    .eq("status", "approved")
    .maybeSingle();
  if (!creatorApp) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }
  return NextResponse.json({ creator: profile });
}
