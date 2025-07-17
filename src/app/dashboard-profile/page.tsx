"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Workflow, Star, Bell, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    publishedWorkflows: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          // Get workflows count
          const { count: totalWorkflows } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profile.id);

          const { count: publishedWorkflows } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", profile.id)
            .eq("status", "approved");

          // Get workflow IDs for interactions
          const { data: workflows } = await supabase
            .from("workflows")
            .select("id")
            .eq("profile_id", profile.id);

          let totalLikes = 0;

          if (workflows && workflows.length > 0) {
            const workflowIds = workflows.map((w) => w.id);

            // Get likes count
            const { count: likesCount } = await supabase
              .from("workflow_interactions")
              .select("*", { count: "exact", head: true })
              .in("workflow_id", workflowIds)
              .eq("type", "star");

            totalLikes = likesCount || 0;
          }

          setStats({
            totalWorkflows: totalWorkflows || 0,
            publishedWorkflows: publishedWorkflows || 0,
            totalLikes,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk melihat dashboard Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali! Kelola workflow dan profil Anda di sini.
          </p>
        </div>
        <Button
          asChild
          className="bg-purple-900 hover:bg-purple-800 text-white"
        >
          <Link href="/dashboard-profile/workflows/add">
            <Plus className="h-4 w-4 mr-2" />
            Share New Template
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workflows
            </CardTitle>
            <Workflow className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalWorkflows}
            </div>
            <p className="text-xs text-gray-600">Semua workflow yang dibuat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.publishedWorkflows}
            </div>
            <p className="text-xs text-gray-600">
              Workflow yang sudah dipublikasikan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Star className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalLikes}
            </div>
            <p className="text-xs text-gray-600">
              Total likes dari semua workflow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <User className="h-4 w-4 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : "0"}</div>
            <p className="text-xs text-gray-600">Total pengikut Anda</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard-profile/profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-700" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kelola profil dan informasi pribadi Anda
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard-profile/workflows">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-gray-700" />
                Workflow Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Lihat dan kelola semua workflow Anda
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard-profile/creator">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gray-700" />
                Creator Saya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kelola status creator dan portfolio Anda
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Empty State for No Workflows */}
      {!loading && stats.totalWorkflows === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <Workflow className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              You did not create any workflow templates yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start sharing your automation workflows with the community
            </p>
            <Button
              asChild
              className="bg-purple-900 hover:bg-purple-800 text-white"
            >
              <Link href="/dashboard-profile/workflows/add">
                <Plus className="h-4 w-4 mr-2" />
                Share New Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
