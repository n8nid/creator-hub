import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: List workflow yang sudah approved
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Ambil workflows yang sudah approved dengan join profiles untuk nama creator
    const { data, error } = await supabase
      .from("workflows")
      .select(
        `
        id, 
        profile_id, 
        title, 
        description, 
        tags, 
        category, 
        screenshot_url, 
        video_url, 
        complexity, 
        status, 
        created_at,
        profiles (
          id,
          name,
          profile_image
        )
      `
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching workflows:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Transform data dengan nama creator yang sebenarnya
    const transformedWorkflows = (data || []).map((workflow: any) => ({
      ...workflow,
      profile_name: workflow.profiles?.name || "Unknown Creator",
      profile_image: workflow.profiles?.profile_image || null,
    }));

    console.log("Workflows found:", transformedWorkflows.length);
    return NextResponse.json({ workflows: transformedWorkflows });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
