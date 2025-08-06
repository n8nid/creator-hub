import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { notificationCreators } from "@/lib/notification-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const appId = params.id;
  const body = await request.json();
  const { status, alasan_penolakan } = body;
  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  // Cek apakah user adalah admin
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .single();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get application data first
  const { data: application } = await supabase
    .from("creator_applications")
    .select("user_id")
    .eq("id", appId)
    .single();

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  // Update status pengajuan
  const updateData: {
    status: string;
    tanggal_approval: string;
    alasan_penolakan?: string;
  } = {
    status,
    tanggal_approval: new Date().toISOString(),
  };
  if (status === "rejected" && alasan_penolakan) {
    updateData.alasan_penolakan = alasan_penolakan;
  }

  const { error } = await supabase
    .from("creator_applications")
    .update(updateData)
    .eq("id", appId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Get user email for notification
  const { data: userData } = await supabase
    .from("users")
    .select("email")
    .eq("id", application.user_id)
    .single();

  const userEmail = userData?.email || "Unknown user";

  // Create notification for the user
  try {
    if (status === "approved") {
      await notificationCreators.creatorApplicationApproved(
        application.user_id,
        userEmail,
        appId
      );
    } else if (status === "rejected") {
      await notificationCreators.creatorApplicationRejected(
        application.user_id,
        userEmail,
        appId,
        alasan_penolakan || "Tidak ada alasan"
      );
    }
  } catch (notificationError) {
    console.error("Error creating notification:", notificationError);
    // Don't fail the request if notification fails
  }

  return NextResponse.json({ success: true });
}
