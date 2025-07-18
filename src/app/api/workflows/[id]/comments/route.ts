import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Ambil semua komentar pada workflow tertentu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const workflowId = params.id;
  const { data, error } = await supabase
    .from("workflow_comments")
    .select("id, user_id, comment, created_at")
    .eq("workflow_id", workflowId)
    .order("created_at", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ comments: data });
}

// POST: Tambah komentar pada workflow oleh user login
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
  const workflowId = params.id;
  const body = await request.json();
  const comment = body.comment?.trim();
  if (!comment) {
    return NextResponse.json(
      { error: "Komentar tidak boleh kosong" },
      { status: 400 }
    );
  }
  const { error } = await supabase.from("workflow_comments").insert({
    workflow_id: workflowId,
    user_id: userId,
    comment,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
