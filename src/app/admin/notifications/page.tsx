"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageSquare,
  AlertTriangle,
  Info,
  AlertCircle,
  Trash2,
  CheckSquare,
  Square,
  MinusSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// Hapus import Supabase client

const NOTIF_TYPES = [
  "all",
  "system",
  "creator_application",
  "workflow_moderation",
  "comment",
  "interaction",
  "warning",
  "report",
  "verification",
  "important",
];

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Hapus ADMIN_ID

  // Fetch notifications function (agar bisa dipanggil ulang)
  const fetchNotifications = async () => {
    setLoading(true);
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const json = await res.json();
      setNotifications(json.notifications || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Supabase Realtime subscribe
  useEffect(() => {
    const supabase = createClientComponentClient();
    const channel = supabase.channel("notifications-admin-panel");
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          // Fetch ulang data jika ada perubahan
          fetchNotifications();
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Statistik
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;
  const today = notifications.filter(
    (n) =>
      n.created_at &&
      new Date(n.created_at).toDateString() === new Date().toDateString()
  ).length;
  // Important: type === 'warning' atau 'important'
  const important = notifications.filter(
    (n) => n.type === "warning" || n.type === "important"
  ).length;

  // Handler mark as read
  const markAsRead = async (notifId: string) => {
    const res = await fetch(`/api/notifications/${notifId}`, {
      method: "PATCH",
    });
    if (!res.ok) {
      const err = await res.json();
      alert(
        "Gagal menandai notifikasi sebagai sudah dibaca: " +
          (err.error || res.status)
      );
      return;
    }
    // Refresh data
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  // Handler hapus notifikasi
  const handleDelete = async (notifId: string) => {
    if (!window.confirm("Yakin ingin menghapus notifikasi ini?")) return;
    const res = await fetch(`/api/notifications/${notifId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      alert("Gagal menghapus notifikasi: " + (err.error || res.status));
      return;
    }
    // Update state lokal agar notifikasi langsung hilang dari tampilan
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    if (selectedNotif && selectedNotif.id === notifId) {
      setModalOpen(false);
      setSelectedNotif(null);
    }
  };

  // Handler open detail modal
  const openDetail = (notif: any) => {
    setSelectedNotif(notif);
    setModalOpen(true);
    if (!notif.read) markAsRead(notif.id);
  };

  // Filter logic
  const filteredNotifications = notifications.filter((notif) => {
    let typeOk =
      typeFilter === "all" ||
      notif.type === typeFilter ||
      (typeFilter === "important" &&
        (notif.type === "important" || notif.type === "warning"));
    let statusOk =
      statusFilter === "all" ||
      (statusFilter === "unread" && !notif.read) ||
      (statusFilter === "read" && notif.read);
    let searchOk =
      !search ||
      notif.message?.toLowerCase().includes(search.toLowerCase()) ||
      notif.type?.toLowerCase().includes(search.toLowerCase()) ||
      notif.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      notif.user_email?.toLowerCase().includes(search.toLowerCase());
    return typeOk && statusOk && searchOk;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / PAGE_SIZE) || 1;
  const pagedNotifications = filteredNotifications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset page ke 1 jika filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Notifikasi</h1>
          <p className="admin-page-subtitle">
            Kelola notifikasi sistem dan pengguna
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <label className="text-sm">Tipe:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {NOTIF_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "Semua" : type}
            </option>
          ))}
        </select>
        <label className="text-sm ml-4">Status:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="border rounded px-2 py-1 text-sm ml-4 flex-1 min-w-[200px]"
          placeholder="Cari notifikasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unread}</div>
            <p className="text-xs text-muted-foreground">Belum dibaca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{today}</div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Important</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{important}</div>
            <p className="text-xs text-muted-foreground">Penting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Total</CardTitle>
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
          <CardTitle className="admin-section-title">Daftar Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : pagedNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Belum ada notifikasi.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {pagedNotifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`py-4 flex flex-col gap-1 ${
                      !notif.read
                        ? "bg-blue-50 cursor-pointer"
                        : "cursor-pointer"
                    }`}
                    onClick={() => openDetail(notif)}
                    title="Lihat detail notifikasi"
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
                      <button
                        className="ml-2 p-1 text-red-500 hover:text-red-700"
                        title="Hapus notifikasi"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-gray-900 text-sm">{notif.message}</div>
                    <div className="text-xs text-gray-500">
                      {notif.user_name || "-"} ({notif.user_email || "-"})
                    </div>
                  </li>
                ))}
              </ul>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
              {/* Modal Detail Notifikasi */}
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Notifikasi</DialogTitle>
                    <DialogDescription>
                      Informasi lengkap notifikasi
                    </DialogDescription>
                  </DialogHeader>
                  {selectedNotif && (
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">Tipe:</span>{" "}
                        {selectedNotif.type}
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>{" "}
                        {selectedNotif.read ? "Read" : "Unread"}
                      </div>
                      <div>
                        <span className="font-semibold">Waktu:</span>{" "}
                        {selectedNotif.created_at
                          ? new Date(selectedNotif.created_at).toLocaleString()
                          : "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Pesan:</span>
                        <div className="bg-gray-100 rounded p-2 mt-1 text-sm">
                          {selectedNotif.message}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold">Nama:</span>{" "}
                        {selectedNotif.user_name || "-"}{" "}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        {selectedNotif.user_email || "-"}
                      </div>
                      {selectedNotif.user_id && (
                        <div>
                          <span className="font-semibold">User ID:</span>{" "}
                          {selectedNotif.user_id}
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <DialogClose asChild>
                          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                            Tutup
                          </button>
                        </DialogClose>
                        <button
                          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(selectedNotif.id)}
                        >
                          Hapus Notifikasi
                        </button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
