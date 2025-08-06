import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import {
  createNotificationForAllAdmins,
  notificationCreators,
} from "@/lib/notification-utils";
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  RELATED_TYPES,
} from "@/lib/supabase";

// POST: User mengajukan menjadi creator
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Cek apakah sudah pernah mengajukan
  const { data: existing } = await supabase
    .from("creator_applications")
    .select("id, status")
    .eq("user_id", userId)
    .single();
  if (existing && existing.status !== "rejected") {
    return NextResponse.json({
      success: true,
      message: "Sudah pernah mengajukan",
    });
  }

  // Insert pengajuan baru
  const { data: newApplication, error } = await supabase
    .from("creator_applications")
    .insert({
      user_id: userId,
      status: "pending",
      tanggal_pengajuan: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Get user email for notification
  const { data: userData } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();

  const userEmail = userData?.email || "Unknown user";

  // Create notification for all admins
  try {
    await createNotificationForAllAdmins({
      type: NOTIFICATION_TYPES.CREATOR_APPLICATION_PENDING,
      title: "Pengajuan Creator Baru",
      message: `User ${userEmail} mengajukan menjadi creator`,
      related_id: newApplication.id,
      related_type: RELATED_TYPES.CREATOR_APPLICATION,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      read: false,
    });
  } catch (notificationError) {
    console.error("Error creating notification:", notificationError);
    // Don't fail the request if notification fails
  }

  return NextResponse.json({ success: true });
}
