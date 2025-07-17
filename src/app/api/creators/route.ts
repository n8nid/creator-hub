import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

// GET: List creator (profile) yang sudah approved dan sudah di-approve sebagai creator
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Debug: Cek semua profiles yang approved
  const { data: allApprovedProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, user_id, name, status, experience_level")
    .eq("status", "approved");

  console.log("All approved profiles:", allApprovedProfiles?.length || 0);

  // Debug: Cek creator_applications yang approved
  const { data: approvedApplications, error: appsError } = await supabase
    .from("creator_applications")
    .select("user_id, status")
    .eq("status", "approved");

  console.log("Approved applications:", approvedApplications?.length || 0);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }

  if (appsError) {
    console.error("Error fetching applications:", appsError);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }

  // Jika ada creator_applications yang approved, gunakan logika original
  if (approvedApplications && approvedApplications.length > 0) {
    const approvedUserIds = approvedApplications.map((app) => app.user_id);

    const { data: creators, error: creatorsError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        name,
        profile_image,
        status,
        experience_level,
        workflows!inner(count)
      `
      )
      .eq("status", "approved")
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

    console.log("Transformed creators:", transformedCreators.length);
    return NextResponse.json(transformedCreators);
  }

  // Fallback: Tampilkan semua profile yang approved jika tidak ada creator_applications
  console.log("Using fallback: showing all approved profiles");

  const { data: fallbackCreators, error: fallbackError } = await supabase
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
    .eq("status", "approved");

  if (fallbackError) {
    console.error("Error fetching fallback creators:", fallbackError);
    return NextResponse.json(
      { error: "Failed to fetch creators" },
      { status: 500 }
    );
  }

  // Transform data untuk menghitung workflow_count
  const transformedFallbackCreators =
    fallbackCreators?.map((creator) => ({
      id: creator.id,
      name: creator.name,
      profile_image: creator.profile_image,
      status: creator.status,
      experience_level: creator.experience_level,
      workflow_count: creator.workflows?.[0]?.count || 0,
    })) || [];

  console.log("Fallback creators:", transformedFallbackCreators.length);
  return NextResponse.json(transformedFallbackCreators);
}
