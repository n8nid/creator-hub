import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: List creator (profile) yang sudah approved dan sudah di-approve sebagai creator
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  // Ambil semua profile yang statusnya approved DAN user_id-nya ada di creator_applications yang statusnya approved
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, user_id, name, bio, location, skills, experience_level, profile_image, status"
    )
    .eq("status", "approved")
    .in(
      "user_id",
      (
        await supabase
          .from("creator_applications")
          .select("user_id")
          .eq("status", "approved")
      ).data?.map((row: any) => row.user_id) || []
    )
    .order("name", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ creators: data });
}
