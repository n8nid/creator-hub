"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  FileText,
  Clock,
  AlertTriangle,
  Shield,
  Bell,
  UserPlus,
  FilePlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // State untuk statistik
  const [stats, setStats] = useState<{
    totalUsers: number | null;
    activeCreators: number | null;
    publishedWorkflows: number | null;
    pendingCreatorApplications: number | null;
    pendingWorkflows: number | null;
  }>({
    totalUsers: null,
    activeCreators: null,
    publishedWorkflows: null,
    pendingCreatorApplications: null,
    pendingWorkflows: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // State untuk aktivitas terbaru
  const [recentActivities, setRecentActivities] = useState<
    {
      id: string;
      type: "user" | "creator_application" | "workflow";
      title: string;
      description: string;
      created_at: string;
    }[]
  >([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Fetch statistik dari Supabase
  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      // Total Users
      const { count: totalUsers } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true });
      // Active Creators
      const { count: activeCreators } = await supabase
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("status", "approved");
      // Published Workflows
      const { count: publishedWorkflows } = await supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      // Pending Creator Applications
      let pendingCreatorApplications = null;
      const {
        data: creatorAppData,
        error: creatorAppError,
        count: creatorAppCount,
      } = await supabase
        .from("creator_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (!creatorAppError) {
        pendingCreatorApplications = creatorAppCount;
      }
      // Pending Workflows
      const { count: pendingWorkflows } = await supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      setStats({
        totalUsers,
        activeCreators,
        publishedWorkflows,
        pendingCreatorApplications,
        pendingWorkflows,
      });
      setStatsLoading(false);
    }
    fetchStats();
  }, []);

  // Fetch recent activities
  useEffect(() => {
    async function fetchActivities() {
      setActivityLoading(true);
      // 1. User baru
      const { data: usersData } = await supabase
        .from("users")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      // 2. Pengajuan creator
      const { data: creatorAppData } = await supabase
        .from("creator_applications")
        .select("id, user_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      // 3. Workflow baru
      const { data: workflowsData } = await supabase
        .from("workflows")
        .select("id, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      // Gabungkan & mapping
      const activities = [
        ...(usersData || []).map((u: any) => ({
          id: u.id,
          type: "user" as const,
          title: "User Baru",
          description: u.email,
          created_at: u.created_at,
        })),
        ...(creatorAppData || []).map((c: any) => ({
          id: c.id,
          type: "creator_application" as const,
          title:
            c.status === "pending"
              ? "Pengajuan Creator Baru"
              : c.status === "approved"
              ? "Creator Disetujui"
              : "Pengajuan Creator Ditolak",
          description: `User ID: ${c.user_id}`,
          created_at: c.created_at,
        })),
        ...(workflowsData || []).map((w: any) => ({
          id: w.id,
          type: "workflow" as const,
          title:
            w.status === "pending"
              ? "Workflow Baru (Pending)"
              : w.status === "approved"
              ? "Workflow Dipublikasikan"
              : "Workflow Ditolak",
          description: w.title,
          created_at: w.created_at,
        })),
      ];
      // Urutkan berdasarkan created_at desc
      activities.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentActivities(activities.slice(0, 10));
      setActivityLoading(false);
    }
    fetchActivities();
  }, []);

  // Redirect to auth if not logged in (client-side guard as backup)
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Statistik cards
  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? "-",
      icon: Users,
      description: "Semua pengguna terdaftar",
      color: "text-blue-600",
    },
    {
      title: "Active Creators",
      value: stats.activeCreators ?? "-",
      icon: UserCheck,
      description: "Creator yang aktif",
      color: "text-green-600",
    },
    {
      title: "Published Workflows",
      value: stats.publishedWorkflows ?? "-",
      icon: FileText,
      description: "Workflow yang dipublikasikan",
      color: "text-purple-600",
    },
    {
      title: "Pending Creator Applications",
      value: stats.pendingCreatorApplications ?? "-",
      icon: UserPlus,
      description: "Pengajuan creator menunggu review",
      color: "text-yellow-600",
    },
    {
      title: "Pending Workflows",
      value: stats.pendingWorkflows ?? "-",
      icon: Clock,
      description: "Workflow menunggu moderasi",
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Review Creator",
      description: "Moderasi pengajuan creator",
      icon: UserCheck,
      href: "/admin/creators",
      color: "text-blue-600",
    },
    {
      title: "Moderasi Workflow",
      description: "Review workflow yang dipublikasikan",
      icon: FileText,
      href: "/admin/workflows",
      color: "text-purple-600",
    },
    {
      title: "Kelola User",
      description: "Manajemen pengguna sistem",
      icon: Users,
      href: "/admin/users",
      color: "text-green-600",
    },
    {
      title: "Lihat Notifikasi",
      description: "Kelola notifikasi sistem",
      icon: Bell,
      href: "/admin/notifications",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-600">Selamat datang di panel administrasi</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <span className="animate-pulse text-gray-400">...</span>
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLoading ? (
                <div className="text-center text-gray-400 animate-pulse">
                  Memuat aktivitas...
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center text-gray-400">
                  Belum ada aktivitas terbaru.
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.type + activity.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3">
                      {activity.type === "user" && (
                        <UserPlus className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === "creator_application" && (
                        <UserCheck className="h-5 w-5 text-green-500" />
                      )}
                      {activity.type === "workflow" && (
                        <FilePlus className="h-5 w-5 text-purple-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(activity.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => router.push(action.href)}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Status</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Backup</span>
              <span className="text-sm text-muted-foreground">
                2 jam yang lalu
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Security</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Secure
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
