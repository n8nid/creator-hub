import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { NotificationInsert } from "@/lib/supabase";

// GET: Ambil semua notifikasi (jika admin) atau notifikasi milik user login, beserta nama dan email user (join manual)
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Cek apakah user adalah admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  let notificationsRes;
  if (adminData) {
    // Jika admin, ambil semua notifikasi dengan field baru
    notificationsRes = await supabase
      .from("notifications")
      .select(
        `
        id,
        user_id,
        type,
        title,
        message,
        related_id,
        related_type,
        priority,
        read,
        created_at,
        updated_at
      `
      )
      .order("created_at", { ascending: false });
  } else {
    // Jika bukan admin, ambil notifikasi miliknya saja
    notificationsRes = await supabase
      .from("notifications")
      .select(
        `
        id,
        user_id,
        type,
        title,
        message,
        related_id,
        related_type,
        priority,
        read,
        created_at,
        updated_at
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  }

  if (notificationsRes.error) {
    return NextResponse.json(
      { error: notificationsRes.error.message },
      { status: 400 }
    );
  }
  const notifications = notificationsRes.data || [];

  // Ambil user_id unik
  const userIds = [
    ...new Set(notifications.map((n) => n.user_id).filter(Boolean)),
  ];
  type UserMap = {
    [id: string]: { email: string | null; name: string | null };
  };
  let usersMap: UserMap = {};
  if (userIds.length > 0) {
    // Fetch data user
    const { data: usersData } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);
    // Fetch data profile
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, name")
      .in("user_id", userIds);
    // Gabungkan ke map
    usersMap = userIds.reduce((acc: UserMap, id: string) => {
      const user = (usersData || []).find((u: any) => u.id === id);
      const profile = (profilesData || []).find((p: any) => p.user_id === id);
      acc[id] = {
        email: user?.email || null,
        name: profile?.name || null,
      };
      return acc;
    }, {} as UserMap);
  }

  // Gabungkan data user ke notifikasi
  const notificationsWithUser = notifications.map((n) => ({
    ...n,
    user_email: usersMap[n.user_id]?.email || null,
    user_name: usersMap[n.user_id]?.name || null,
  }));

  return NextResponse.json({ notifications: notificationsWithUser });
}

// POST: Buat notifikasi baru (untuk admin atau sistem)
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Cek apakah user adalah admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  if (!adminData) {
    return NextResponse.json(
      { error: "Forbidden - Admin only" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const notificationData: NotificationInsert = {
      user_id: body.user_id,
      type: body.type,
      title: body.title,
      message: body.message,
      related_id: body.related_id || null,
      related_type: body.related_type || null,
      priority: body.priority || "medium",
      read: body.read || false,
    };

    const { data, error } = await supabase
      .from("notifications")
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notification: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
