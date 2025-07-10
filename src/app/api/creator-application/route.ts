import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// POST: User mengajukan menjadi creator
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Cek apakah sudah pernah mengajukan
  const { data: existing } = await supabase
    .from("creator_applications")
    .select("id, status")
    .eq("user_id", userId)
    .single();
  if (existing && existing.status !== "rejected") {
    return NextResponse.json({
      success: true,
      message: "Sudah pernah mengajukan",
    });
  }

  // Insert pengajuan baru
  const { error } = await supabase.from("creator_applications").insert({
    user_id: userId,
    status: "pending",
    tanggal_pengajuan: new Date().toISOString(),
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
