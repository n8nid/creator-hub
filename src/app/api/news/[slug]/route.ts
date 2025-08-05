import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Get news detail by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Fetch news by slug
    const { data: news, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json({ error: "News not found" }, { status: 404 });
      }
      console.error("Error fetching news:", error);
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: 500 }
      );
    }

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Update view count
    try {
      await supabase
        .from("news")
        .update({ views: (news.views || 0) + 1 })
        .eq("id", news.id);
    } catch (viewError) {
      console.error("Error updating view count:", viewError);
      // Don't fail the request for view count update
    }

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
