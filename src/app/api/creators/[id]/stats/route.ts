import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const profileId = params.id;

  // Coba ambil dari tabel creator_stats
  const { data: stats, error: statsError } = await supabase
    .from("creator_stats")
    .select("*")
    .eq("profile_id", profileId)
    .single();
  if (stats && !statsError) {
    return NextResponse.json({ stats });
  }

  // Jika tidak ada di creator_stats, hitung manual
  // Jumlah follower
  const { count: followerCount } = await supabase
    .from("creator_followers")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", profileId);
  // Jumlah like (star) di semua workflow milik creator
  const { data: workflows } = await supabase
    .from("workflows")
    .select("id")
    .eq("profile_id", profileId);
  const workflowIds = (workflows || []).map((w) => w.id);
  let likeCount = 0;
  let workflowCount = workflowIds.length;
  if (workflowIds.length > 0) {
    const { count: starCount } = await supabase
      .from("workflow_interactions")
      .select("id", { count: "exact", head: true })
      .in("workflow_id", workflowIds)
      .eq("type", "star");
    likeCount = starCount || 0;
  }
  return NextResponse.json({
    stats: {
      total_followers: followerCount || 0,
      total_likes: likeCount,
      total_workflows: workflowCount,
    },
  });
}
