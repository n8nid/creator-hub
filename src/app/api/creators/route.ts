import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: List creator yang sudah approved di creator_applications
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Ambil user_id yang sudah approved di creator_applications
    const { data: approvedUsers, error: approvedUsersError } = await supabase
      .from("creator_applications")
      .select("user_id")
      .eq("status", "approved");

    if (approvedUsersError) {
      console.error("Error fetching approved users:", approvedUsersError);
      return NextResponse.json(
        { error: "Failed to fetch approved users" },
        { status: 500 }
      );
    }

    if (!approvedUsers || approvedUsers.length === 0) {
      console.log("No approved creators found");
      return NextResponse.json([]);
    }

    const approvedUserIds = approvedUsers.map((app) => app.user_id);

    // Ambil profiles dari user yang sudah approved di creator_applications
    const { data: creators, error: creatorsError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        name,
        profile_image,
        status,
        experience_level,
        workflows(count)
      `
      )
      .in("user_id", approvedUserIds);

    if (creatorsError) {
      console.error("Error fetching creators:", creatorsError);
      return NextResponse.json(
        { error: "Failed to fetch creators" },
        { status: 500 }
      );
    }

    // Transform data untuk menghitung workflow_count
    const transformedCreators =
      creators?.map((creator) => ({
        id: creator.id,
        name: creator.name,
        profile_image: creator.profile_image,
        status: creator.status,
        experience_level: creator.experience_level,
        workflow_count: creator.workflows?.[0]?.count || 0,
      })) || [];

    console.log("Creators found:", transformedCreators.length);
    return NextResponse.json(transformedCreators);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
