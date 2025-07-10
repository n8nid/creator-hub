import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// POST: Follow creator
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const creatorId = params.id;

  // Cek apakah sudah follow
  const { data: existing } = await supabase
    .from("creator_followers")
    .select("id")
    .eq("creator_id", creatorId)
    .eq("follower_id", userId)
    .single();
  if (existing) {
    return NextResponse.json({ success: true, message: "Sudah follow" });
  }

  // Insert follow
  const { error } = await supabase.from("creator_followers").insert({
    creator_id: creatorId,
    follower_id: userId,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

// DELETE: Unfollow creator
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const creatorId = params.id;

  // Hapus follow
  const { error } = await supabase
    .from("creator_followers")
    .delete()
    .eq("creator_id", creatorId)
    .eq("follower_id", userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
