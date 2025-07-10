import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Detail workflow yang sudah approved
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const workflowId = params.id;
  const { data, error } = await supabase
    .from("workflows")
    .select(
      "id, profile_id, title, description, tags, category, screenshot_url, video_url, complexity, status, created_at"
    )
    .eq("id", workflowId)
    .eq("status", "approved")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }
  return NextResponse.json({ workflow: data });
}
