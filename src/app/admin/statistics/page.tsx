"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

export default function StatisticsPage() {
  const [stats, setStats] = useState<{
    totalUsers: number | null;
    activeCreators: number | null;
    publishedWorkflows: number | null;
    growthRate: number | null;
  }>({
    totalUsers: null,
    activeCreators: null,
    publishedWorkflows: null,
    growthRate: null,
  });
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [creatorStatus, setCreatorStatus] = useState([
    { name: "Pending", value: 0 },
    { name: "Approved", value: 0 },
    { name: "Rejected", value: 0 },
  ]);
  const [workflowStatus, setWorkflowStatus] = useState([
    { name: "Pending", value: 0 },
    { name: "Approved", value: 0 },
    { name: "Rejected", value: 0 },
  ]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const supabase = createClientComponentClient();
      // Total Users (hanya yang punya profile)
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("user_id", { count: "exact", head: true });
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
      // Growth Rate (dummy, bisa diganti dengan perhitungan real)
      const growthRate =
        totalUsers && activeCreators
          ? Math.round((activeCreators / totalUsers) * 100 * 100) / 100
          : null;
      setStats({
        totalUsers,
        activeCreators,
        publishedWorkflows,
        growthRate,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTrend = async () => {
      const supabase = createClientComponentClient();
      // Ambil data pengajuan creator per bulan
      const { data: creatorApps } = await supabase
        .from("creator_applications")
        .select("id, tanggal_pengajuan")
        .order("tanggal_pengajuan", { ascending: true });
      // Ambil data workflow per bulan
      const { data: workflows } = await supabase
        .from("workflows")
        .select("id, created_at")
        .order("created_at", { ascending: true });
      // Gabungkan dan olah data per bulan
      const monthMap: Record<string, { creator: number; workflow: number }> =
        {};
      creatorApps?.forEach((c: any) => {
        const date = new Date(c.tanggal_pengajuan);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        if (!monthMap[key]) monthMap[key] = { creator: 0, workflow: 0 };
        monthMap[key].creator++;
      });
      workflows?.forEach((w: any) => {
        const date = new Date(w.created_at);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        if (!monthMap[key]) monthMap[key] = { creator: 0, workflow: 0 };
        monthMap[key].workflow++;
      });
      // Ubah ke array dan urutkan
      const trendArr = Object.entries(monthMap)
        .map(([month, val]) => ({ month, ...val }))
        .sort((a, b) => a.month.localeCompare(b.month));
      setTrendData(trendArr);
    };
    fetchTrend();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      const supabase = createClientComponentClient();
      // Creator status
      const { count: pending } = await supabase
        .from("creator_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      const { count: approved } = await supabase
        .from("creator_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      const { count: rejected } = await supabase
        .from("creator_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "rejected");
      setCreatorStatus([
        { name: "Pending", value: pending || 0 },
        { name: "Approved", value: approved || 0 },
        { name: "Rejected", value: rejected || 0 },
      ]);
      // Workflow status
      const { count: wPending } = await supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      const { count: wApproved } = await supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      const { count: wRejected } = await supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "rejected");
      setWorkflowStatus([
        { name: "Pending", value: wPending || 0 },
        { name: "Approved", value: wApproved || 0 },
        { name: "Rejected", value: wRejected || 0 },
      ]);
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchUserGrowth = async () => {
      const supabase = createClientComponentClient();
      const { data: users } = await supabase
        .from("users")
        .select("id, created_at")
        .order("created_at", { ascending: true });
      const monthMap: Record<string, number> = {};
      users?.forEach((u: any) => {
        const date = new Date(u.created_at);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key]++;
      });
      const growthArr = Object.entries(monthMap)
        .map(([month, value]) => ({ month, value }))
        .sort((a, b) => a.month.localeCompare(b.month));
      setUserGrowth(growthArr);
    };
    fetchUserGrowth();
  }, []);

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  // Tambahkan fungsi custom label
  const renderCustomLabel = ({ name, value, percent }: any) =>
    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Statistik</h1>
          <p className="admin-page-subtitle">
            Analisis data dan performa platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalUsers ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* +12% dari bulan lalu */}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Active Creators</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.activeCreators ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">
              Published Workflows
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.publishedWorkflows ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Growth Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : stats.growthRate !== null
                ? `${stats.growthRate}%`
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">Rata-rata bulanan</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Tren Pengajuan */}
      <Card>
        <CardHeader>
          <CardTitle className="admin-section-title">
            Tren Pengajuan Creator & Workflow per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="creator" fill="#6366f1" name="Creator" />
                <Bar dataKey="workflow" fill="#f472b6" name="Workflow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Grafik Distribusi Status */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Statistik distribusi status pengajuan creator dan workflow akan segera
        tersedia.
      </div>

      {/* Grafik User Baru per Bulan */}
      <Card>
        <CardHeader>
          <CardTitle className="admin-section-title">
            Pertumbuhan User Baru per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userGrowth}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" name="User Baru" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Keterangan Pengembangan */}
      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          Fitur panel statistik lanjutan, analisis performa, dan laporan
          aktivitas platform akan segera tersedia.
        </p>
      </div>
    </div>
  );
}
