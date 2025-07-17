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
} from "lucide-react";
import Link from "next/link";

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
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
    <div className="space-y-8 mt-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creator Saya</h1>
          <p className="text-gray-600 mt-2">
            Kelola status creator dan portfolio Anda
          </p>
        </div>
        {(!creatorStatus || creatorStatus?.status === "rejected") && (
          <Button asChild>
            <Link href="/creator-application">
              <Plus className="h-4 w-4 mr-2" />
              Ajukan Sebagai Creator
            </Link>
          </Button>
        )}
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.profile_image} alt={profile?.name} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                {profile?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.name || "User"}
                </h2>
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <Link href="/dashboard-profile/profile/edit">
                    <Edit className="w-3 h-3 mr-1" />
                    Lengkapi Profil
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {profile?.experience_level || "Beginner"}
                  </Badge>
                </div>
                {profile?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.workflowCount}
                  </div>
                  <div className="text-xs text-gray-600">Workflow</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalLikes}
                  </div>
                  <div className="text-xs text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.followerCount}
                  </div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Status Aplikasi Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {getStatusBadge(creatorStatus?.status || "not_applied")}
            <span className="text-sm text-gray-600">
              {creatorStatus?.status === "approved"
                ? "Creator Aktif"
                : creatorStatus?.status === "pending"
                ? "Menunggu Review"
                : creatorStatus?.status === "rejected"
                ? "Ditolak"
                : "Belum Mengajukan"}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {getStatusDescription(creatorStatus?.status || "not_applied")}
          </p>

          {creatorStatus?.alasan_penolakan && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">
                Alasan Penolakan:
              </h4>
              <p className="text-sm text-red-700">
                {creatorStatus.alasan_penolakan}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!creatorStatus && (
              <Button asChild>
                <Link href="/creator-application">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajukan Sebagai Creator
                </Link>
              </Button>
            )}
            {creatorStatus?.status === "rejected" && (
              <Button asChild>
                <Link href="/creator-application">
                  <Edit className="h-4 w-4 mr-2" />
                  Ajukan Ulang
                </Link>
              </Button>
            )}
            {creatorStatus?.status === "approved" && (
              <Button asChild className="bg-purple-900 hover:bg-purple-800">
                <Link href="/dashboard-profile/workflows/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Mulai Bagikan Workflow
                </Link>
              </Button>
            )}
            {creatorStatus?.status === "pending" && (
              <Button variant="outline" asChild>
                <Link href="/creator-application">Lihat Detail Aplikasi</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Creator Dashboard - Recent Activity */}
      {creatorStatus?.status === "approved" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600">
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
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Belum ada aktivitas terbaru. Mulai dengan mengupload workflow
                  pertama Anda!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State for Not Applied */}
      {!creatorStatus && (
        <Card className="text-center py-16">
          <CardContent>
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Anda belum mengajukan diri sebagai creator
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai perjalanan Anda sebagai creator n8n Indonesia dan bagikan
              workflow automation Anda
            </p>
            <Button asChild>
              <Link href="/creator-application">
                <Plus className="h-4 w-4 mr-2" />
                Ajukan Sebagai Creator
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
