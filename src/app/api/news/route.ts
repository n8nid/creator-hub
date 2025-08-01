import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: List news yang sudah published
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    let query = supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("published_date", { ascending: false });

    // Filter featured news if requested
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching news:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("News found:", data?.length || 0);
    return NextResponse.json({ news: data || [] });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
