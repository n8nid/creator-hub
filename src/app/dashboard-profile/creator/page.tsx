"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Users,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function CreatorPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [creatorStatus, setCreatorStatus] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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
        const { data: creatorApp } = await supabase
          .from("creator_applications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        setCreatorStatus(creatorApp);
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
    <div className="space-y-10 mt-4">
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

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Status Creator
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
        </CardContent>
      </Card>

      {/* Creator Stats */}
      {creatorStatus?.status === "approved" && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Followers
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-600">Pengikut Anda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Workflows
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-600">Workflow dipublikasikan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-600">Likes dari workflow</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard-profile/profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Update Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Perbarui informasi profil dan portfolio Anda
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard-profile/workflows">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Manage Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kelola dan publikasikan workflow Anda
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

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
