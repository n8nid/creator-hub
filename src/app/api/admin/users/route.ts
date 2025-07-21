import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you can implement your own admin check logic)
    const { data: adminCheck, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch users with service role (bypass RLS)
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, created_at");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
