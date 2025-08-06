import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { NotificationUpdate } from "@/lib/supabase";

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

  try {
    const body = await request.json();

    // Prepare update data with type safety
    const updateData: NotificationUpdate = {
      updated_at: new Date().toISOString(),
    };

    // Allow updating read status for all users
    if (body.read !== undefined) {
      updateData.read = body.read;
    }

    // Only admin can update other fields
    if (adminData) {
      if (body.type !== undefined) updateData.type = body.type;
      if (body.title !== undefined) updateData.title = body.title;
      if (body.message !== undefined) updateData.message = body.message;
      if (body.related_id !== undefined)
        updateData.related_id = body.related_id;
      if (body.related_type !== undefined)
        updateData.related_type = body.related_type;
      if (body.priority !== undefined) updateData.priority = body.priority;
    }

    let updateQuery = supabase
      .from("notifications")
      .update(updateData)
      .eq("id", notifId);

    if (!adminData) {
      // Jika bukan admin, hanya boleh update notifikasi miliknya sendiri
      updateQuery = updateQuery.eq("user_id", userId);
    }

    const { data, error } = await updateQuery.select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notification: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
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
