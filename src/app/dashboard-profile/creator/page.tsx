"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Users,
  MapPin,
  Award,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  UserPlus,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function CreatorSubPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [followedCreators, setFollowedCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [creatorStats, setCreatorStats] = useState<any>(null);
  const [showResubmit, setShowResubmit] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const fetchProfileAndCreatorStatus = async () => {
      if (!user) return;
      // Ambil profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(profileData);
      // Cek apakah user sudah menjadi creator (ada pengajuan approved)
      const { data: creatorApp } = await supabase
        .from("creator_applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .maybeSingle();
      setIsCreator(!!creatorApp);
      // Fetch statistik jika sudah creator
      if (creatorApp && profileData) {
        const { data: stats } = await supabase
          .from("creator_stats")
          .select("*")
          .eq("profile_id", profileData.id)
          .single();
        setCreatorStats(stats);
      }
    };
    fetchProfileAndCreatorStatus();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchFollowedCreators = async () => {
      setLoading(true);
      try {
        // Ambil creator yang di-follow oleh user
        const { data: followers } = await supabase
          .from("creator_followers")
          .select(
            `
            creator_id,
            profiles!creator_followers_creator_id_fkey (
              id,
              name,
              bio,
              location,
              profile_image,
              experience_level,
              skills,
              status
            )
          `
          )
          .eq("follower_id", user.id);

        if (followers) {
          const creators = followers
            .map((f) =>
              Array.isArray(f.profiles) ? f.profiles[0] : f.profiles
            )
            .filter((creator) => creator && creator.status === "approved");
          setFollowedCreators(creators);
        }
      } catch (error) {
        console.error("Error fetching followed creators:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data creator yang di-follow",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFollowedCreators();
  }, [user, toast]);

  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      setLoadingApps(true);
      const { data } = await supabase
        .from("creator_applications")
        .select(
          "id, status, tanggal_pengajuan, tanggal_approval, alasan_penolakan"
        )
        .eq("user_id", user.id)
        .order("tanggal_pengajuan", { ascending: false });
      setApplications(data || []);
      setLoadingApps(false);
    };
    fetchApplications();
  }, [user]);

  const handleUnfollow = async (creatorId: string) => {
    try {
      const { error } = await supabase
        .from("creator_followers")
        .delete()
        .eq("creator_id", creatorId)
        .eq("follower_id", user?.id);

      if (error) {
        toast({
          title: "Gagal unfollow",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Remove from local state
      setFollowedCreators((prev) => prev.filter((c) => c.id !== creatorId));
      toast({
        title: "Berhasil unfollow",
        description: "Creator telah dihapus dari daftar follow",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal melakukan unfollow",
        variant: "destructive",
      });
    }
  };

  // Handler pengajuan/ajukan ulang
  const handleAjukanCreator = async () => {
    try {
      const { error } = await supabase.from("creator_applications").insert({
        user_id: user?.id,
        status: "pending",
        tanggal_pengajuan: new Date().toISOString(),
      });
      if (error) {
        toast({
          title: "Gagal mengajukan",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      // Insert notifikasi ke admin (hardcode user_id admin)
      const ADMIN_ID = "f3533c71-fc66-4df9-9efa-968d685f2de4"; // Ganti dengan UUID admin dari Supabase
      await supabase.from("notifications").insert({
        user_id: ADMIN_ID,
        type: "creator_application",
        message: `Ada pengajuan creator baru dari ${user?.email}`,
        read: false,
      });
      toast({
        title: "Pengajuan berhasil",
        description:
          "Pengajuan creator berhasil dikirim. Mohon tunggu review admin.",
        variant: "default",
      });
      setShowResubmit(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengajukan creator.",
        variant: "destructive",
      });
    }
  };

  // Stepper visual status
  // Cari status aplikasi creator terakhir
  const lastApp = applications[0];
  let statusStep = 0;
  let statusLabel = "Belum Mengajukan Creator";
  let statusIcon = <FileText className="w-5 h-5 text-gray-400" />;

  if (!lastApp) {
    statusStep = 0;
    statusLabel = "Belum Mengajukan Creator";
    statusIcon = <FileText className="w-5 h-5 text-gray-400" />;
  } else if (lastApp.status === "pending") {
    statusStep = 1;
    statusLabel = "Menunggu Review";
    statusIcon = <Clock className="w-5 h-5 text-yellow-500" />;
  } else if (lastApp.status === "approved") {
    statusStep = 2;
    statusLabel = "Creator Aktif";
    statusIcon = <CheckCircle className="w-5 h-5 text-green-600" />;
  } else if (lastApp.status === "rejected") {
    statusStep = 3;
    statusLabel = "Ditolak";
    statusIcon = <XCircle className="w-5 h-5 text-red-500" />;
  }

  // Cari status terakhir
  const canResubmit = lastApp && lastApp.status === "rejected";

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk melihat creator Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Creator Saya</h2>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                profile?.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : profile?.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : profile?.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {statusIcon}
              <span className="ml-1">{statusLabel}</span>
            </span>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/creators">
            <ExternalLink className="w-4 h-4 mr-2" />
            Lihat Semua Creator
          </Link>
        </Button>
      </div>

      {/* Stepper visual */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div
          className={`flex flex-col items-center ${
            statusStep >= 0 ? "" : "opacity-50"
          }`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-xs mt-1">Draft</span>
        </div>
        <div
          className={`h-1 w-8 ${
            statusStep >= 1 ? "bg-blue-500" : "bg-gray-200"
          } rounded-full`}
        />
        <div
          className={`flex flex-col items-center ${
            statusStep >= 1 ? "" : "opacity-50"
          }`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs mt-1">Pending</span>
        </div>
        <div
          className={`h-1 w-8 ${
            statusStep >= 2 ? "bg-blue-500" : "bg-gray-200"
          } rounded-full`}
        />
        <div
          className={`flex flex-col items-center ${
            statusStep === 3 ? "" : "opacity-50"
          }`}
        >
          <CheckCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Approved</span>
        </div>
      </div>

      {/* Alur status creator */}
      {profile?.status === "draft" && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  Belum Mengajukan Creator
                </h3>
                <p className="text-sm text-blue-700">
                  Lengkapi profil Anda lalu ajukan untuk menjadi creator.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAjukanCreator} variant="default">
              <UserPlus className="w-4 h-4 mr-2" /> Ajukan Jadi Creator
            </Button>
          </CardContent>
        </Card>
      )}
      {profile?.status === "pending" && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-yellow-900">
                  Pengajuan Diproses
                </h3>
                <p className="text-sm text-yellow-700">
                  Pengajuan Anda sedang direview admin. Mohon tunggu maksimal
                  1x24 jam.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
      {profile?.status === "rejected" && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Pengajuan Ditolak
                </h3>
                <p className="text-sm text-red-700">
                  {profile.admin_notes ||
                    "Pengajuan Anda ditolak. Silakan perbaiki data dan ajukan ulang."}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAjukanCreator} variant="default">
              <UserPlus className="w-4 h-4 mr-2" /> Ajukan Ulang Creator
            </Button>
          </CardContent>
        </Card>
      )}
      {profile?.status === "approved" && profile && (
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Anda adalah Creator
                </h3>
                <p className="text-sm text-gray-600">
                  Profil Anda sudah terverifikasi sebagai creator
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.profile_image || undefined} />
                <AvatarFallback className="text-lg">
                  {profile.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {profile.bio}
                </p>
                {profile.location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {profile.location}
                    </span>
                  </div>
                )}
              </div>
              <Button asChild size="sm">
                <Link href="/dashboard-profile/profile">Kelola Profil</Link>
              </Button>
            </div>
            {/* Statistik Creator */}
            {creatorStats ? (
              <div className="flex gap-8 mt-4">
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-6 h-6 text-purple-500 mb-1" />
                  <span className="font-bold text-lg">
                    {creatorStats.total_workflows}
                  </span>
                  <span className="text-xs text-gray-500">Workflow</span>
                </div>
                <div className="flex flex-col items-center">
                  <UserPlus className="w-6 h-6 text-pink-500 mb-1" />
                  <span className="font-bold text-lg">
                    {creatorStats.total_followers}
                  </span>
                  <span className="text-xs text-gray-500">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="w-6 h-6 text-yellow-500 mb-1" />
                  <span className="font-bold text-lg">
                    {creatorStats.total_likes}
                  </span>
                  <span className="text-xs text-gray-500">Likes</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 mt-4">
                Statistik creator belum tersedia.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* List creator yang di-follow */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Creator yang Diikuti ({followedCreators.length})
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : followedCreators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedCreators.map((creator) => (
              <Card
                key={creator.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={creator.profile_image || undefined} />
                      <AvatarFallback className="text-sm">
                        {creator.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {creator.name}
                      </h4>
                      {creator.experience_level && (
                        <Badge variant="secondary" className="mt-1">
                          {creator.experience_level}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {creator.bio || "Tidak ada deskripsi"}
                  </p>

                  {creator.location && (
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {creator.location}
                      </span>
                    </div>
                  )}

                  {creator.skills && creator.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {creator.skills
                        .slice(0, 3)
                        .map((skill: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      {creator.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{creator.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Link href={`/creators/${creator.id}`}>
                        <Users className="w-3 h-3 mr-1" />
                        Lihat Profil
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUnfollow(creator.id)}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Unfollow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada creator yang diikuti
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai ikuti creator favorit Anda untuk melihat update terbaru
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            >
              <Link href="/creators">
                <Star className="w-4 h-4 mr-2" />
                Jelajahi Creator
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Riwayat Pengajuan Creator</h2>
        {loadingApps ? (
          <div>Loading riwayat pengajuan...</div>
        ) : applications.length === 0 ? (
          <div>Belum ada riwayat pengajuan creator.</div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Tanggal Pengajuan</th>
                <th className="px-4 py-2 text-left">Tanggal Approval</th>
                <th className="px-4 py-2 text-left">Alasan Penolakan</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="px-4 py-2 capitalize">{app.status}</td>
                  <td className="px-4 py-2">
                    {app.tanggal_pengajuan
                      ? new Date(app.tanggal_pengajuan).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {app.tanggal_approval
                      ? new Date(app.tanggal_approval).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{app.alasan_penolakan || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {canResubmit && (
          <div className="mt-4">
            <Button onClick={handleAjukanCreator}>
              Ajukan Ulang Sebagai Creator
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
