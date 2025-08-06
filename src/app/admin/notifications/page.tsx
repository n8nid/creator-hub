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
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Users,
  Newspaper,
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
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  RELATED_TYPES,
} from "@/lib/supabase";

// Updated notification types based on our implementation
const NOTIF_TYPES = [
  { value: "all", label: "Semua", icon: Info },
  {
    value: "creator_application_pending",
    label: "Pengajuan Creator",
    icon: User,
  },
  {
    value: "creator_application_approved",
    label: "Creator Disetujui",
    icon: CheckCircle,
  },
  {
    value: "creator_application_rejected",
    label: "Creator Ditolak",
    icon: XCircle,
  },
  {
    value: "workflow_submission_pending",
    label: "Workflow Pending",
    icon: FileText,
  },
  {
    value: "workflow_approved",
    label: "Workflow Disetujui",
    icon: CheckCircle,
  },
  { value: "workflow_rejected", label: "Workflow Ditolak", icon: XCircle },
  { value: "user_registration", label: "User Baru", icon: Users },
  { value: "content_moderation", label: "Moderasi Konten", icon: Newspaper },
];

const PRIORITY_FILTERS = [
  { value: "all", label: "Semua Prioritas" },
  { value: "high", label: "Tinggi", color: "text-red-600" },
  { value: "medium", label: "Sedang", color: "text-yellow-600" },
  { value: "low", label: "Rendah", color: "text-green-600" },
];

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

const PAGE_SIZE = 10;

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

// Helper function to get type icon
const getTypeIcon = (type: string) => {
  const typeConfig = NOTIF_TYPES.find((t) => t.value === type);
  return typeConfig?.icon || Info;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
  // Important: priority === 'high'
  const important = notifications.filter((n) => n.priority === "high").length;

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
    let typeOk = typeFilter === "all" || notif.type === typeFilter;
    let priorityOk =
      priorityFilter === "all" || notif.priority === priorityFilter;
    let statusOk =
      statusFilter === "all" ||
      (statusFilter === "unread" && !notif.read) ||
      (statusFilter === "read" && notif.read);
    let searchOk =
      !search ||
      notif.title?.toLowerCase().includes(search.toLowerCase()) ||
      notif.message?.toLowerCase().includes(search.toLowerCase()) ||
      notif.type?.toLowerCase().includes(search.toLowerCase()) ||
      notif.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      notif.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      notif.related_type?.toLowerCase().includes(search.toLowerCase());
    return typeOk && priorityOk && statusOk && searchOk;
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
  }, [typeFilter, priorityFilter, statusFilter, search]);

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
        <label className="text-sm font-medium">Tipe:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {NOTIF_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium ml-4">Prioritas:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {PRIORITY_FILTERS.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium ml-4">Status:</label>
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
          placeholder="Cari notifikasi (judul, pesan, user, tipe)..."
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
          <CardTitle className="admin-section-title">
            Daftar Notifikasi
          </CardTitle>
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
                {pagedNotifications.map((notif) => {
                  const TypeIcon = getTypeIcon(notif.type);
                  return (
                    <li
                      key={notif.id}
                      className={`py-4 flex flex-col gap-2 ${
                        !notif.read
                          ? "bg-blue-50 cursor-pointer"
                          : "cursor-pointer"
                      } hover:bg-gray-50 transition-colors`}
                      onClick={() => openDetail(notif)}
                      title="Lihat detail notifikasi"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-xs font-semibold uppercase text-gray-500">
                            {NOTIF_TYPES.find((t) => t.value === notif.type)
                              ?.label || notif.type}
                          </span>
                        </div>

                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(
                            notif.priority
                          )}`}
                        >
                          {notif.priority === "high"
                            ? "Tinggi"
                            : notif.priority === "medium"
                            ? "Sedang"
                            : notif.priority === "low"
                            ? "Rendah"
                            : "Normal"}
                        </span>

                        {/* Read Status */}
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
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

                      {/* Title */}
                      <div className="text-gray-900 font-medium">
                        {notif.title || "No Title"}
                      </div>

                      {/* Message */}
                      <div className="text-gray-700 text-sm">
                        {notif.message}
                      </div>

                      {/* User Info & Related Data */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>
                          {notif.user_name || "-"} ({notif.user_email || "-"})
                        </div>
                        <div className="flex items-center gap-2">
                          {notif.related_type && (
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                              {notif.related_type}
                            </span>
                          )}
                          {notif.related_id && (
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                              ID: {notif.related_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Detail Notifikasi</DialogTitle>
                    <DialogDescription>
                      Informasi lengkap notifikasi
                    </DialogDescription>
                  </DialogHeader>
                  {selectedNotif && (
                    <div className="space-y-4">
                      {/* Header Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold text-gray-700">
                            Tipe:
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const TypeIcon = getTypeIcon(selectedNotif.type);
                              return (
                                <>
                                  <TypeIcon className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {NOTIF_TYPES.find(
                                      (t) => t.value === selectedNotif.type
                                    )?.label || selectedNotif.type}
                                  </span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Prioritas:
                          </span>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                                selectedNotif.priority
                              )}`}
                            >
                              {selectedNotif.priority === "high"
                                ? "Tinggi"
                                : selectedNotif.priority === "medium"
                                ? "Sedang"
                                : selectedNotif.priority === "low"
                                ? "Rendah"
                                : "Normal"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold text-gray-700">
                            Status:
                          </span>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                selectedNotif.read
                                  ? "bg-gray-200 text-gray-500"
                                  : "bg-blue-200 text-blue-800"
                              }`}
                            >
                              {selectedNotif.read ? "Read" : "Unread"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Waktu:
                          </span>
                          <div className="text-sm mt-1">
                            {selectedNotif.created_at
                              ? new Date(
                                  selectedNotif.created_at
                                ).toLocaleString()
                              : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <span className="font-semibold text-gray-700">
                          Judul:
                        </span>
                        <div className="text-lg font-medium mt-1 text-gray-900">
                          {selectedNotif.title || "No Title"}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <span className="font-semibold text-gray-700">
                          Pesan:
                        </span>
                        <div className="bg-gray-100 rounded p-3 mt-1 text-sm">
                          {selectedNotif.message}
                        </div>
                      </div>

                      {/* User Info */}
                      <div>
                        <span className="font-semibold text-gray-700">
                          User:
                        </span>
                        <div className="text-sm mt-1">
                          {selectedNotif.user_name || "-"} (
                          {selectedNotif.user_email || "-"})
                        </div>
                      </div>

                      {/* Related Data */}
                      {(selectedNotif.related_type ||
                        selectedNotif.related_id) && (
                        <div>
                          <span className="font-semibold text-gray-700">
                            Data Terkait:
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {selectedNotif.related_type && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Tipe: {selectedNotif.related_type}
                              </span>
                            )}
                            {selectedNotif.related_id && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-mono">
                                ID: {selectedNotif.related_id}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">
                            Tutup
                          </Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(selectedNotif.id)}
                          className="flex-1"
                        >
                          Hapus Notifikasi
                        </Button>
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
