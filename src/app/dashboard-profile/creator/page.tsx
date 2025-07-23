"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Users,
  TrendingUp,
  Plus,
  MapPin,
  Edit,
  Activity,
  Heart,
  UserPlus,
  FileText,
  Send,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreatorPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [creatorStatus, setCreatorStatus] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    workflowCount: 0,
    totalLikes: 0,
    followerCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!user) return;

      try {
        // Get user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setProfile(profileData);

        // Get creator application status
        let creatorApp = null;
        try {
          const { data: creatorAppData, error: creatorAppError } =
            await supabase
              .from("creator_applications")
              .select("*")
              .eq("user_id", user.id)
              .order("tanggal_pengajuan", { ascending: false })
              .limit(1)
              .maybeSingle();

          if (creatorAppError && creatorAppError.message) {
            console.error(
              "Error fetching creator application:",
              creatorAppError.message
            );
          }

          creatorApp = creatorAppData;
          setCreatorStatus(creatorApp);
        } catch (error) {
          console.error("Exception in creator application fetch:", error);
          setCreatorStatus(null);
        }

        // Get creator statistics if approved
        if (creatorApp && creatorApp.status === "approved" && profileData?.id) {
          // Get workflow count
          const { count: workflowCount } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profileData.id);

          // Get total likes (placeholder - implement when likes system is ready)
          const totalLikes = 0;

          // Get follower count (placeholder - implement when follow system is ready)
          const followerCount = 0;

          setStats({
            workflowCount: workflowCount || 0,
            totalLikes,
            followerCount,
          });

          // Get recent activity
          const { data: recentWorkflows } = await supabase
            .from("workflows")
            .select("id, title, created_at")
            .eq("profile_id", profileData.id)
            .order("created_at", { ascending: false })
            .limit(5);

          const activities = (recentWorkflows || []).map((workflow) => ({
            type: "workflow_upload",
            title: `Workflow "${workflow.title}" diupload`,
            date: workflow.created_at,
            icon: FileText,
          }));

          setRecentActivity(activities);
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [user, supabase]);

  // Function to submit creator application
  const handleSubmitCreatorApplication = async () => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/creator-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Sudah pernah mengajukan") {
          toast.info("Anda sudah pernah mengajukan sebagai creator");
        } else {
          toast.success("Pengajuan creator berhasil dikirim!");
          // Refresh creator status
          const { data: creatorAppData } = await supabase
            .from("creator_applications")
            .select("*")
            .eq("user_id", user.id)
            .order("tanggal_pengajuan", { ascending: false })
            .limit(1)
            .single();
          setCreatorStatus(creatorAppData);
        }
      } else {
        toast.error(data.error || "Gagal mengirim pengajuan");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Terjadi kesalahan saat mengirim pengajuan");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Not Applied</Badge>;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "approved":
        return "Selamat! Anda telah disetujui sebagai creator. Anda dapat mulai mempublikasikan workflow dan membangun portfolio Anda.";
      case "pending":
        return "Pengajuan Anda sedang dalam proses review. Tim kami akan meninjau aplikasi Anda dalam waktu 2-3 hari kerja.";
      case "rejected":
        return "Pengajuan Anda belum disetujui. Silakan perbaiki portfolio Anda dan ajukan kembali.";
      default:
        return "Anda belum mengajukan diri sebagai creator. Mulai perjalanan Anda sebagai creator n8n Indonesia.";
    }
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</p>
        <p className="text-gray-600 mb-6">
          Silakan login untuk melihat halaman creator Anda.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-4 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center px-2">
        <div className="flex-1 min-w-0">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">Creator Saya</p>
          <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">
            Kelola status creator dan portfolio Anda
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="mx-2 sm:mx-0">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <AvatarImage src={profile?.profile_image} alt={profile?.name} />
              <AvatarFallback className="text-lg sm:text-xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                {profile?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  {profile?.name || "User"}
                </h2>
                <Button variant="outline" size="sm" asChild className="text-xs w-full sm:w-auto">
                  <Link href="/dashboard-profile/profile/edit">
                    <Edit className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Lengkapi Profil</span>
                    <span className="sm:hidden">Lengkapi</span>
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs break-words">
                    {profile?.experience_level || "Beginner"}
                  </Badge>
                </div>
                {profile?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="break-words">{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.workflowCount}
                  </div>
                  <div className="text-xs text-gray-600 break-words">Workflow</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.totalLikes}
                  </div>
                  <div className="text-xs text-gray-600 break-words">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.followerCount}
                  </div>
                  <div className="text-xs text-gray-600 break-words">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status Section */}
      <Card className="mx-2 sm:mx-0">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <span className="break-words">Status Aplikasi Creator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {getStatusBadge(creatorStatus?.status || "not_applied")}
            <span className="text-sm text-gray-600 break-words">
              {creatorStatus?.status === "approved"
                ? "Creator Aktif"
                : creatorStatus?.status === "pending"
                  ? "Menunggu Review"
                  : creatorStatus?.status === "rejected"
                    ? "Ditolak"
                    : "Belum Mengajukan"}
            </span>
          </div>
          <p className="text-sm text-gray-600 break-words">
            {getStatusDescription(creatorStatus?.status || "not_applied")}
          </p>

          {creatorStatus?.alasan_penolakan && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-red-800 mb-2 break-words">
                Alasan Penolakan:
              </h4>
              <p className="text-sm text-red-700 break-words">
                {creatorStatus.alasan_penolakan}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {!creatorStatus && (
              <Button
                onClick={handleSubmitCreatorApplication}
                disabled={submitting}
                className="bg-purple-900 hover:bg-purple-800 w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Mengirim Pengajuan...</span>
                    <span className="sm:hidden">Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Ajukan Sebagai Creator</span>
                    <span className="sm:hidden">Ajukan Creator</span>
                  </>
                )}
              </Button>
            )}
            {creatorStatus?.status === "rejected" && (
              <Button
                onClick={handleSubmitCreatorApplication}
                disabled={submitting}
                className="bg-purple-900 hover:bg-purple-800 w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Mengirim Pengajuan...</span>
                    <span className="sm:hidden">Mengirim...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Ajukan Ulang
                  </>
                )}
              </Button>
            )}
            {creatorStatus?.status === "approved" && (
              <Button asChild className="bg-purple-900 hover:bg-purple-800 w-full sm:w-auto">
                <Link href="/dashboard-profile/workflows/add">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Mulai Bagikan Workflow</span>
                  <span className="sm:hidden">Bagikan Workflow</span>
                </Link>
              </Button>
            )}
            {creatorStatus?.status === "pending" && (
              <Button variant="outline" disabled className="w-full sm:w-auto">
                <Clock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Menunggu Review</span>
                <span className="sm:hidden">Menunggu</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Creator Dashboard - Recent Activity */}
      {creatorStatus?.status === "approved" && (
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="break-words">Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 break-words">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 break-words">
                          {new Date(activity.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 px-4">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-sm sm:text-base break-words">
                  Belum ada aktivitas terbaru. Mulai dengan mengupload workflow
                  pertama Anda!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
