import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Featured content untuk hero carousel (news dan events)
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Fetch featured events
    const { data: featuredEvents, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("event_date", { ascending: true })
      .limit(5);

    if (eventsError) {
      console.error("Error fetching featured events:", eventsError);
    }

    // Fetch featured news
    const { data: featuredNews, error: newsError } = await supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_date", { ascending: false })
      .limit(5);

    if (newsError) {
      console.error("Error fetching featured news:", newsError);
    }

    // Combine and sort by date (newest first)
    const allFeatured = [
      ...(featuredEvents || []).map((event) => ({
        ...event,
        type: "event",
        display_date: event.event_date,
      })),
      ...(featuredNews || []).map((news) => ({
        ...news,
        type: "news",
        display_date: news.published_date,
      })),
    ].sort(
      (a, b) =>
        new Date(b.display_date).getTime() - new Date(a.display_date).getTime()
    );

    return NextResponse.json({
      featured: allFeatured.slice(0, 5), // Return max 5 items
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
