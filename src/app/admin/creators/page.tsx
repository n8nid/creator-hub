"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface CreatorApplication {
  id: string;
  user_id: string;
  status: string;
  tanggal_pengajuan?: string;
  tanggal_approval?: string;
  alasan_penolakan?: string;
  user_email?: string;
  profile_name?: string;
}

export default function ModerasiCreatorPage() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [pendingApps, setPendingApps] = useState<CreatorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch statistik dan daftar pengajuan
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Statistik
      const [
        { count: pending },
        { count: approved },
        { count: rejected },
        { count: total },
      ] = await Promise.all([
        supabase
          .from("creator_applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("creator_applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase
          .from("creator_applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "rejected"),
        supabase
          .from("creator_applications")
          .select("id", { count: "exact", head: true }),
      ]);
      setStats({
        pending: pending ?? 0,
        approved: approved ?? 0,
        rejected: rejected ?? 0,
        total: total ?? 0,
      });
      // Daftar pengajuan (pending)
      const { data: apps } = await supabase
        .from("creator_applications")
        .select(
          `id, user_id, status, tanggal_pengajuan, users(email), profiles(name)`
        )
        .eq("status", "pending")
        .order("tanggal_pengajuan", { ascending: false });
      setPendingApps(
        (apps || []).map((a: any) => ({
          id: a.id,
          user_id: a.user_id,
          status: a.status,
          tanggal_pengajuan: a.tanggal_pengajuan,
          user_email: a.users?.email || "",
          profile_name: a.profiles?.name || "",
        }))
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  // Aksi approve/reject
  const handleAction = async (
    appId: string,
    userId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setActionLoading(appId);
    // Update status di creator_applications
    const updates: any = { status: newStatus };
    if (newStatus === "approved")
      updates.tanggal_approval = new Date().toISOString();
    const { error } = await supabase
      .from("creator_applications")
      .update(updates)
      .eq("id", appId);
    if (error) {
      toast({
        title: "Gagal update status",
        description: error.message,
        variant: "destructive",
      });
      setActionLoading(null);
      return;
    }
    // Jika approve, update juga status di profiles
    if (newStatus === "approved") {
      await supabase
        .from("profiles")
        .update({ status: "approved" })
        .eq("user_id", userId);
    }
    toast({ title: `Status berhasil diubah menjadi ${newStatus}` });
    // Refresh data
    setPendingApps((prev) => prev.filter((a) => a.id !== appId));
    setStats((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      [newStatus]: prev[newStatus] + 1,
    }));
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderasi Creator</h1>
          <p className="text-gray-600">Kelola pengajuan dan status creator</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Creator aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Semua pengajuan</p>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Pengajuan Creator Pending */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan Creator (Pending)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : pendingApps.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Tidak ada pengajuan pending.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Tanggal Pengajuan</th>
                    <th className="px-4 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApps.map((app) => (
                    <tr key={app.id} className="border-b">
                      <td className="px-4 py-2">{app.profile_name}</td>
                      <td className="px-4 py-2">{app.user_email}</td>
                      <td className="px-4 py-2">
                        {app.tanggal_pengajuan
                          ? new Date(app.tanggal_pengajuan).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={actionLoading === app.id}
                          onClick={() =>
                            handleAction(app.id, app.user_id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoading === app.id}
                          onClick={() =>
                            handleAction(app.id, app.user_id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
