import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Detail creator (profile) yang sudah approved
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const profileId = params.id;
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, user_id, name, bio, location, skills, experience_level, profile_image, status"
    )
    .eq("id", profileId)
    .eq("status", "approved")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }
  return NextResponse.json({ creator: data });
}
