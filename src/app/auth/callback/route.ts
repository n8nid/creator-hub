import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    console.log("Exchanging OAuth code for session...");
    await supabase.auth.exchangeCodeForSession(code);
    console.log("OAuth session exchange completed");
  }

  // URL to redirect to after sign in process completes
  console.log("Redirecting after OAuth callback");

  // Check if user is admin and redirect accordingly
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (adminUser) {
        console.log("User is admin, redirecting to /admin");
        return NextResponse.redirect(new URL("/admin", requestUrl.origin));
      } else {
        console.log("User is not admin, redirecting to /dashboard-profile");
        return NextResponse.redirect(
          new URL("/dashboard-profile", requestUrl.origin)
        );
      }
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
  }

  // Fallback redirect
  console.log("Fallback redirect to /dashboard-profile");
  return NextResponse.redirect(
    new URL("/dashboard-profile", requestUrl.origin)
  );
}
