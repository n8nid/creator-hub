import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: Get event detail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Event ID parameter is required" },
        { status: 400 }
      );
    }

    // Fetch event by ID
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .in("status", ["published", "upcoming"])
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      console.error("Error fetching event:", error);
      return NextResponse.json(
        { error: "Failed to fetch event" },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update view count
    try {
      await supabase
        .from("events")
        .update({ views: (event.views || 0) + 1 })
        .eq("id", event.id);
    } catch (viewError) {
      console.error("Error updating view count:", viewError);
      // Don't fail the request for view count update
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
