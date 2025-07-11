"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageSquare,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ADMIN_ID = "f3533c71-fc66-4df9-9efa-968d685f2de4";

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", ADMIN_ID)
        .order("created_at", { ascending: false });
      if (!error) setNotifications(data || []);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  // Statistik
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;
  const today = notifications.filter(
    (n) =>
      n.created_at &&
      new Date(n.created_at).toDateString() === new Date().toDateString()
  ).length;
  const important = notifications.filter((n) => n.type === "important").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi</h1>
          <p className="text-gray-600">Kelola notifikasi sistem dan pengguna</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unread}</div>
            <p className="text-xs text-muted-foreground">Belum dibaca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{today}</div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Important</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{important}</div>
            <p className="text-xs text-muted-foreground">Penting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Info className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">Semua notifikasi</p>
          </CardContent>
        </Card>
      </div>

      {/* List Notifikasi */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Belum ada notifikasi.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`py-4 flex flex-col gap-1 ${
                    !notif.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      {notif.type}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        notif.read
                          ? "bg-gray-200 text-gray-500"
                          : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {notif.read ? "Read" : "Unread"}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {notif.created_at
                        ? new Date(notif.created_at).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <div className="text-gray-900 text-sm">{notif.message}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
