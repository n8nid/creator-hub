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
  const workflowId = params.id;
  const body = await request.json();
  const { status, admin_notes } = body;
  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }
  // Cek apakah user adalah admin
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .single();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // Update status workflow
  const updateData = {
    status,
    admin_notes: admin_notes || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("workflows")
    .update(updateData)
    .eq("id", workflowId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
