"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  Star,
  Activity,
  FileText,
  Shield,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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

interface CreatorProfile {
  id: string;
  user_id: string;
  name: string;
  bio?: string;
  about_markdown?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  skills?: string[];
  experience_level?: string;
  hourly_rate?: number;
  availability?: string;
  profile_image?: string;
  status: string;
  admin_notes?: string;
  instagram?: string;
  threads?: string;
  discord?: string;
  youtube?: string;
  Whatsapp?: string; // Changed to match database field name
  created_at?: string;
  updated_at?: string;
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedApp, setSelectedApp] = useState<CreatorApplication | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCreatorProfile, setSelectedCreatorProfile] =
    useState<CreatorProfile | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

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
      // Ambil data pengajuan tanpa join
      const { data: apps } = await supabase
        .from("creator_applications")
        .select("id, user_id, status, tanggal_pengajuan")
        .eq("status", "pending")
        .order("tanggal_pengajuan", { ascending: false });
      // Fetch data user dan profile manual
      const userIds = (apps || []).map((a: any) => a.user_id);
      // Ambil data users
      const { data: usersData } = await supabase
        .from("users")
        .select("id, email")
        .in("id", userIds);
      // Ambil data profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);
      setPendingApps(
        (apps || []).map((a: any) => ({
          id: a.id,
          user_id: a.user_id,
          status: a.status,
          tanggal_pengajuan: a.tanggal_pengajuan,
          user_email:
            usersData?.find((u: any) => u.id === a.user_id)?.email || "",
          profile_name:
            profilesData?.find((p: any) => p.user_id === a.user_id)?.name || "",
        }))
      );
      console.log("apps", apps);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch creator detail
  const handleShowDetail = async (userId: string) => {
    setDetailLoading(true);
    try {
      // Fetch complete profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        toast({
          title: "Gagal mengambil detail creator",
          description: profileError.message,
          variant: "destructive",
        });
        return;
      }

      setSelectedCreatorProfile(profileData);
      setDetailDialogOpen(true);
    } catch (err: any) {
      toast({
        title: "Gagal mengambil detail creator",
        description: err?.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  // Aksi approve
  const handleApprove = async (appId: string, userId: string) => {
    setActionLoading(appId);
    try {
      // Update status di creator_applications
      const { error } = await supabase
        .from("creator_applications")
        .update({
          status: "approved",
          tanggal_approval: new Date().toISOString(),
        })
        .eq("id", appId);

      if (error) {
        toast({
          title: "Gagal approve pengajuan",
          description: error.message,
          variant: "destructive",
        });
        setActionLoading(null);
        return;
      }

      // Update status di profiles
      await supabase
        .from("profiles")
        .update({ status: "approved" })
        .eq("user_id", userId);

      toast({ title: "Pengajuan berhasil diapprove" });

      // Refresh data
      setPendingApps((prev) => prev.filter((a) => a.id !== appId));
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));
    } catch (err: any) {
      toast({
        title: "Gagal approve pengajuan",
        description: err?.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Moderasi Creator</h1>
          <p className="admin-page-subtitle">
            Kelola pengajuan dan status creator
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Creator aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Total</CardTitle>
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
          <CardTitle className="admin-section-title">
            Daftar Pengajuan Creator (Pending)
          </CardTitle>
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
                          variant="outline"
                          disabled={detailLoading}
                          onClick={() => handleShowDetail(app.user_id)}
                        >
                          Detail
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={actionLoading === app.id}
                          onClick={() => handleApprove(app.id, app.user_id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoading === app.id}
                          onClick={() => {
                            setSelectedApp(app);
                            setRejectDialogOpen(true);
                          }}
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

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alasan Penolakan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="reason">Alasan Penolakan</Label>
            <Textarea
              id="reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px] border-red-200 focus:border-red-500 focus:ring-red-500"
              placeholder="Tulis alasan penolakan..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!selectedApp) return;
                setActionLoading(selectedApp.id);
                const { error } = await supabase
                  .from("creator_applications")
                  .update({
                    status: "rejected",
                    alasan_penolakan: rejectReason,
                  })
                  .eq("id", selectedApp.id);
                if (error) {
                  toast({
                    title: "Gagal menolak pengajuan",
                    description: error.message,
                    variant: "destructive",
                  });
                  setActionLoading(null);
                  return;
                }
                // Update status di profiles
                await supabase
                  .from("profiles")
                  .update({ status: "rejected" })
                  .eq("user_id", selectedApp.user_id);
                toast({ title: "Pengajuan ditolak" });
                setPendingApps((prev) =>
                  prev.filter((a) => a.id !== selectedApp.id)
                );
                setStats((prev) => ({
                  ...prev,
                  pending: prev.pending - 1,
                  rejected: prev.rejected + 1,
                }));
                setRejectDialogOpen(false);
                setRejectReason("");
                setSelectedApp(null);
                setActionLoading(null);
              }}
              disabled={actionLoading === selectedApp?.id}
            >
              Konfirmasi Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Creator Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div>Detail Creator</div>
                <div className="text-sm font-normal text-gray-600">
                  {selectedCreatorProfile?.name}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Memuat detail creator...
              </p>
            </div>
          ) : selectedCreatorProfile ? (
            <div className="space-y-6 py-4">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                {selectedCreatorProfile.profile_image ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={selectedCreatorProfile.profile_image}
                      alt={selectedCreatorProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedCreatorProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedCreatorProfile.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedCreatorProfile.bio || "No bio available"}
                  </p>
                  {selectedCreatorProfile.location && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {selectedCreatorProfile.location}
                    </div>
                  )}
                </div>
              </div>

              {/* About Section - Moved here */}
              {selectedCreatorProfile.about_markdown && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      Tentang Creator
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedCreatorProfile.about_markdown,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Information Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <UserCheck className="h-4 w-4 text-blue-600" />
                        </div>
                        Informasi Dasar
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Nama Lengkap
                          </label>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCreatorProfile.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <MessageCircle className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Bio
                          </label>
                          <p className="text-sm text-gray-700 mt-1">
                            {selectedCreatorProfile.bio || (
                              <span className="text-gray-400 italic">
                                Belum ada bio
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Lokasi
                          </label>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCreatorProfile.location || (
                              <span className="text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                          <Star className="h-4 w-4 text-purple-600" />
                        </div>
                        Profesional
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Star className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Level Pengalaman
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.experience_level ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full capitalize">
                                {selectedCreatorProfile.experience_level}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <CheckCircle className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Ketersediaan
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.availability ? (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                  selectedCreatorProfile.availability ===
                                  "available"
                                    ? "bg-green-100 text-green-800"
                                    : selectedCreatorProfile.availability ===
                                      "busy"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {selectedCreatorProfile.availability}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Info Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        Informasi Pengajuan
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Tanggal Dibuat
                          </label>
                          <div className="mt-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedCreatorProfile.created_at
                                ? new Date(
                                    selectedCreatorProfile.created_at
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Belum ada"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Activity className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Terakhir Diupdate
                          </label>
                          <div className="mt-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedCreatorProfile.updated_at
                                ? new Date(
                                    selectedCreatorProfile.updated_at
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Belum ada"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Social Media & Contact Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 rounded-lg">
                          <Activity className="h-4 w-4 text-indigo-600" />
                        </div>
                        Social Media & Kontak
                      </h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Globe className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Website
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.website ? (
                              <a
                                href={selectedCreatorProfile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {selectedCreatorProfile.website}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Linkedin className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            LinkedIn
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.linkedin ? (
                              <a
                                href={selectedCreatorProfile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {selectedCreatorProfile.linkedin}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Github className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            GitHub
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.github ? (
                              <a
                                href={selectedCreatorProfile.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-700 hover:text-gray-900 hover:underline font-medium"
                              >
                                {selectedCreatorProfile.github}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Twitter className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Twitter/X
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.twitter ? (
                              <a
                                href={selectedCreatorProfile.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-600 hover:underline font-medium"
                              >
                                {selectedCreatorProfile.twitter}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Instagram className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Instagram
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.instagram ? (
                              <a
                                href={selectedCreatorProfile.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-pink-600 hover:text-pink-800 hover:underline font-medium"
                              >
                                {selectedCreatorProfile.instagram}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Youtube className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            YouTube
                          </label>
                          <div className="mt-1">
                            {selectedCreatorProfile.youtube ? (
                              <a
                                href={selectedCreatorProfile.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium"
                              >
                                {selectedCreatorProfile.youtube}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Belum ada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <MessageCircle className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Discord
                          </label>
                          <div className="mt-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedCreatorProfile.discord || (
                                <span className="text-gray-400 italic">
                                  Belum ada
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <Phone className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            WhatsApp
                          </label>
                          <div className="mt-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedCreatorProfile?.Whatsapp || (
                                <span className="text-gray-400 italic">
                                  Belum ada
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                          <MessageCircle className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Threads
                          </label>
                          <div className="mt-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedCreatorProfile.threads || (
                                <span className="text-gray-400 italic">
                                  Belum ada
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedCreatorProfile.admin_notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Catatan Admin
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      {selectedCreatorProfile.admin_notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDetailDialogOpen(false)}
            >
              Tutup
            </Button>
            {selectedCreatorProfile && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // Find the application for this creator
                    const app = pendingApps.find(
                      (a) => a.user_id === selectedCreatorProfile.user_id
                    );
                    if (app) {
                      handleApprove(app.id, app.user_id);
                      setDetailDialogOpen(false);
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    // Find the application for this creator
                    const app = pendingApps.find(
                      (a) => a.user_id === selectedCreatorProfile.user_id
                    );
                    if (app) {
                      setSelectedApp(app);
                      setDetailDialogOpen(false);
                      setRejectDialogOpen(true);
                    }
                  }}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
