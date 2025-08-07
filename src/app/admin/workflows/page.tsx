"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

interface Workflow {
  id: string;
  title: string;
  status: string;
  created_at: string;
  profile_id: string;
  admin_notes?: string;
  description?: string;
  profile_name?: string;
  tanggal_approval?: string | null;
  json_n8n?: string;
  screenshot_url?: string;
  tags?: string[];
  category?: string;
  complexity?: string;
}

export default function ModerasiWorkflowPage() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [pendingWorkflows, setPendingWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tab, setTab] = useState<string>("pending");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),
      supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("status", "rejected"),
      supabase.from("workflows").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      pending: pending ?? 0,
      approved: approved ?? 0,
      rejected: rejected ?? 0,
      total: total ?? 0,
    });
    // Query workflows sesuai tab, filter & search (tanpa join)
    let query = supabase
      .from("workflows")
      .select(
        "id, title, status, created_at, profile_id, admin_notes, tanggal_approval"
      )
      .order("created_at", { ascending: false });
    if (tab !== "all") {
      query = query.eq("status", tab);
    }
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }
    const { data: workflows } = await query;
    // Ambil semua profile_id unik
    const profileIds = [...new Set((workflows || []).map((w) => w.profile_id))];
    // Ambil semua profile sekaligus
    let profilesMap: Record<string, string> = {};
    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", profileIds);
      profilesMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = p.name;
        return acc;
      }, {} as Record<string, string>);
    }
    // Mapping nama profile ke workflow
    const workflowsWithName = (workflows || []).map((w) => ({
      ...w,
      profile_name: profilesMap[w.profile_id] || "-",
    }));
    setPendingWorkflows(workflowsWithName);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, statusFilter, searchQuery]);

  // Approve workflow
  const handleApprove = async (workflowId: string) => {
    setActionLoading(workflowId);
    const { error } = await supabase
      .from("workflows")
      .update({
        status: "approved",
        tanggal_approval: new Date().toISOString(),
      })
      .eq("id", workflowId);
    if (error) {
      toast({
        title: "Gagal approve workflow",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Workflow berhasil di-approve" });
      fetchData();
    }
    setActionLoading(null);
  };

  // Reject workflow
  const handleReject = async (workflowId: string, reason: string) => {
    setActionLoading(workflowId);
    const { error } = await supabase
      .from("workflows")
      .update({
        status: "rejected",
        admin_notes: reason,
        tanggal_approval: new Date().toISOString(),
      })
      .eq("id", workflowId);
    if (error) {
      toast({
        title: "Gagal reject workflow",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Workflow berhasil di-reject" });
      fetchData();
    }
    setActionLoading(null);
    setShowRejectDialog(null);
    setRejectReason("");
  };

  const handleShowDetail = async (workflowId: string) => {
    setDetailLoading(true);
    setDetailDialogOpen(true);
    const { data } = await supabase
      .from("workflows")
      .select(
        "id, title, status, created_at, profile_id, admin_notes, description, tanggal_approval, json_n8n, screenshot_url, tags, category, complexity"
      )
      .eq("id", workflowId)
      .single();
    let profileName = "-";
    if (data?.profile_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", data.profile_id)
        .single();
      profileName = profile?.name || "-";
    }
    if (data) {
      setSelectedWorkflow({
        id: data.id || "",
        title: data.title || "",
        status: data.status || "",
        created_at: data.created_at || "",
        profile_id: data.profile_id || "",
        admin_notes: data.admin_notes || "",
        description: data.description || "",
        profile_name: profileName,
        tanggal_approval: data.tanggal_approval || null,
        json_n8n: data.json_n8n || "",
        screenshot_url: data.screenshot_url || "",
        tags: data.tags || [],
        category: data.category || "",
        complexity: data.complexity || "",
      });
    } else {
      setSelectedWorkflow(null);
    }
    setDetailLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-page-title">Moderasi Workflow</h1>
          <p className="admin-page-subtitle">
            Review dan kelola workflow yang dipublikasikan
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-4 mb-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">Semua</TabsTrigger>
          </TabsList>
        </Tabs>
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <Input
          placeholder="Cari judul workflow..."
          className="w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="admin-card-title">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Workflow aktif</p>
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
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Semua workflow</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Workflow sesuai tab */}
      <Card>
        <CardHeader>
          <CardTitle className="admin-section-title">
            {tab === "pending"
              ? "Daftar Workflow Pending"
              : tab === "approved"
              ? "Daftar Workflow Approved"
              : tab === "rejected"
              ? "Daftar Workflow Rejected"
              : "Semua Workflow"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : pendingWorkflows.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Tidak ada workflow {tab !== "all" ? tab : ""}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left">Judul</th>
                    <th className="px-4 py-2 text-left">Creator</th>
                    <th className="px-4 py-2 text-left">Tanggal Pengajuan</th>
                    {(tab === "approved" || tab === "rejected") && (
                      <th className="px-4 py-2 text-left">Tanggal Approval</th>
                    )}
                    {tab === "rejected" && (
                      <th className="px-4 py-2 text-left">Alasan Penolakan</th>
                    )}
                    {tab === "pending" && (
                      <th className="px-4 py-2 text-left">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {pendingWorkflows.map((wf) => (
                    <tr key={wf.id} className="border-b">
                      <td className="px-4 py-2">{wf.title}</td>
                      <td className="px-4 py-2">{wf.profile_name || "-"}</td>
                      <td className="px-4 py-2">
                        {wf.created_at
                          ? new Date(wf.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      {(tab === "approved" || tab === "rejected") && (
                        <td className="px-4 py-2">
                          {wf.tanggal_approval
                            ? new Date(wf.tanggal_approval).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </td>
                      )}
                      {tab === "rejected" && (
                        <td className="px-4 py-2">{wf.admin_notes || "-"}</td>
                      )}
                      {tab === "pending" && (
                        <td className="px-4 py-2 space-x-2">
                          <Dialog
                            open={detailDialogOpen}
                            onOpenChange={setDetailDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleShowDetail(wf.id)}
                              >
                                Lihat Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader className="pb-4 border-b border-gray-200">
                                <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <div>Detail Workflow</div>
                                    <div className="text-sm font-normal text-gray-600">
                                      {selectedWorkflow?.title}
                                    </div>
                                  </div>
                                </DialogTitle>
                              </DialogHeader>

                              {detailLoading ? (
                                <div className="py-12 text-center">
                                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                  <p className="mt-4 text-gray-600 font-medium">
                                    Memuat detail workflow...
                                  </p>
                                </div>
                              ) : selectedWorkflow ? (
                                <div className="space-y-6 py-4">
                                  {/* Basic Information */}
                                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4 border-b border-gray-100">
                                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                          <FileText className="h-4 w-4 text-blue-600" />
                                        </div>
                                        Informasi Dasar
                                      </h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                                          <FileText className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Judul Workflow
                                          </label>
                                          <p className="text-sm font-medium text-gray-900 mt-1">
                                            {selectedWorkflow.title}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                                          <User className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Creator
                                          </label>
                                          <p className="text-sm font-medium text-gray-900 mt-1">
                                            {selectedWorkflow.profile_name ||
                                              "-"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                                          <Calendar className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Tanggal Pengajuan
                                          </label>
                                          <p className="text-sm font-medium text-gray-900 mt-1">
                                            {selectedWorkflow.created_at
                                              ? new Date(
                                                  selectedWorkflow.created_at
                                                ).toLocaleDateString("id-ID", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                                })
                                              : "-"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Description Card */}
                                  {selectedWorkflow.description && (
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="p-4 border-b border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                          <div className="p-1.5 bg-indigo-100 rounded-lg">
                                            <MessageSquare className="h-4 w-4 text-indigo-600" />
                                          </div>
                                          Deskripsi
                                        </h3>
                                      </div>
                                      <div className="p-4">
                                        <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                                          <ReactMarkdown>
                                            {selectedWorkflow.description}
                                          </ReactMarkdown>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Workflow Preview */}
                                  {selectedWorkflow.json_n8n && (
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="p-4 border-b border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                          <div className="p-1.5 bg-green-100 rounded-lg">
                                            <Eye className="h-4 w-4 text-green-600" />
                                          </div>
                                          Preview Workflow
                                        </h3>
                                      </div>
                                      <div className="p-4">
                                        <div className="border rounded-lg bg-gray-50 p-4 overflow-x-auto">
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: `<n8n-demo workflow='${selectedWorkflow.json_n8n.replace(
                                                /'/g,
                                                "&#39;"
                                              )}' frame="true"></n8n-demo>`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Admin Notes (if exists) */}
                                  {selectedWorkflow.admin_notes && (
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="p-4 border-b border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                          <div className="p-1.5 bg-red-100 rounded-lg">
                                            <Shield className="h-4 w-4 text-red-600" />
                                          </div>
                                          Catatan Admin
                                        </h3>
                                      </div>
                                      <div className="p-4">
                                        <p className="text-sm text-gray-700">
                                          {selectedWorkflow.admin_notes}
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
                                {selectedWorkflow && tab === "pending" && (
                                  <>
                                    <Button
                                      className="bg-green-600 hover:bg-green-700"
                                      disabled={
                                        actionLoading === selectedWorkflow.id
                                      }
                                      onClick={() => {
                                        handleApprove(selectedWorkflow.id);
                                        setDetailDialogOpen(false);
                                      }}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      disabled={
                                        actionLoading === selectedWorkflow.id
                                      }
                                      onClick={() => {
                                        setShowRejectDialog(
                                          selectedWorkflow.id
                                        );
                                        setDetailDialogOpen(false);
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={actionLoading === wf.id}
                            onClick={() => handleApprove(wf.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionLoading === wf.id}
                            onClick={() => setShowRejectDialog(wf.id)}
                          >
                            Reject
                          </Button>
                          {/* Dialog alasan penolakan */}
                          <Dialog
                            open={showRejectDialog === wf.id}
                            onOpenChange={(open) =>
                              !open && setShowRejectDialog(null)
                            }
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Alasan Penolakan</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <Label htmlFor="reason">Alasan Penolakan</Label>
                                <Textarea
                                  id="reason"
                                  value={rejectReason}
                                  onChange={(e) =>
                                    setRejectReason(e.target.value)
                                  }
                                  className="min-h-[100px]"
                                  placeholder="Tulis alasan penolakan..."
                                />
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowRejectDialog(null)}
                                >
                                  Batal
                                </Button>
                                <Button
                                  variant="destructive"
                                  disabled={
                                    actionLoading === wf.id ||
                                    !rejectReason.trim()
                                  }
                                  onClick={() =>
                                    handleReject(wf.id, rejectReason)
                                  }
                                >
                                  Konfirmasi Reject
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </td>
                      )}
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
