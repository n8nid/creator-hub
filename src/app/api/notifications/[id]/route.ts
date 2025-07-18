import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
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
  const notifId = params.id;

  // Cek apakah user adalah admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  let updateQuery = supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notifId);
  if (!adminData) {
    // Jika bukan admin, hanya boleh update notifikasi miliknya sendiri
    updateQuery = updateQuery.eq("user_id", userId);
  }
  const { error } = await updateQuery;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

// Handler DELETE notifikasi
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
  const notifId = params.id;

  // Cek apakah user adalah admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  let deleteQuery = supabase.from("notifications").delete().eq("id", notifId);
  if (!adminData) {
    // Jika bukan admin, hanya boleh hapus notifikasi miliknya sendiri
    deleteQuery = deleteQuery.eq("user_id", userId);
  }
  const { error } = await deleteQuery;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
