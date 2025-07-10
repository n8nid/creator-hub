import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  // Mendapatkan session user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const workflowId = params.id;

  // Cek apakah user sudah pernah memberi bintang
  const { data: existing, error: checkError } = await supabase
    .from("workflow_interactions")
    .select("id")
    .eq("workflow_id", workflowId)
    .eq("user_id", userId)
    .eq("type", "star")
    .single();
  if (existing) {
    return NextResponse.json({
      success: true,
      message: "Sudah pernah memberi bintang",
    });
  }

  // Insert bintang
  const { error } = await supabase.from("workflow_interactions").insert({
    workflow_id: workflowId,
    user_id: userId,
    type: "star",
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  // Mendapatkan session user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const workflowId = params.id;

  // Hapus bintang
  const { error } = await supabase
    .from("workflow_interactions")
    .delete()
    .eq("workflow_id", workflowId)
    .eq("user_id", userId)
    .eq("type", "star");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
