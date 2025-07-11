"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Workflow {
  id: string;
  title: string;
  status: string;
  created_at: string;
  profile_id: string;
  profiles?: { name: string } | { name: string }[] | null;
  alasan_penolakan?: string;
  description?: string;
}

export default function ModerasiWorkflowPage() {
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
    // Query workflows sesuai tab, filter & search
    let query = supabase
      .from("workflows")
      .select(
        "id, title, status, created_at, profile_id, profiles(name), alasan_penolakan"
      )
      .order("created_at", { ascending: false });
    if (tab !== "all") {
      query = query.eq("status", tab);
    }
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }
    const { data: workflows } = await query;
    setPendingWorkflows(workflows || []);
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
      .update({ status: "rejected", alasan_penolakan: reason })
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
    const { data } = await supabase
      .from("workflows")
      .select(
        "id, title, status, created_at, profile_id, profiles(name), alasan_penolakan, description"
      )
      .eq("id", workflowId)
      .single();
    setSelectedWorkflow(data);
    setDetailLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderasi Workflow</h1>
          <p className="text-gray-600">
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
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Eye className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Workflow aktif</p>
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
          <CardTitle>
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
                      <td className="px-4 py-2">
                        {Array.isArray(wf.profiles)
                          ? wf.profiles[0]?.name || "-"
                          : wf.profiles?.name || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {wf.created_at
                          ? new Date(wf.created_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      {tab === "rejected" && (
                        <td className="px-4 py-2">
                          {wf.alasan_penolakan || "-"}
                        </td>
                      )}
                      {tab === "pending" && (
                        <td className="px-4 py-2 space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleShowDetail(wf.id)}
                              >
                                Lihat Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detail Workflow</DialogTitle>
                                <DialogDescription>
                                  {detailLoading || !selectedWorkflow ? (
                                    <div>Loading...</div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div>
                                        <b>Judul:</b> {selectedWorkflow.title}
                                      </div>
                                      <div>
                                        <b>Status:</b> {selectedWorkflow.status}
                                      </div>
                                      <div>
                                        <b>Creator:</b>{" "}
                                        {Array.isArray(
                                          selectedWorkflow.profiles
                                        )
                                          ? selectedWorkflow.profiles[0]?.name
                                          : selectedWorkflow.profiles?.name ||
                                            "-"}
                                      </div>
                                      <div>
                                        <b>Tanggal Pengajuan:</b>{" "}
                                        {selectedWorkflow.created_at
                                          ? new Date(
                                              selectedWorkflow.created_at
                                            ).toLocaleDateString("id-ID")
                                          : "-"}
                                      </div>
                                      {selectedWorkflow.description && (
                                        <div>
                                          <b>Deskripsi:</b>{" "}
                                          {selectedWorkflow.description}
                                        </div>
                                      )}
                                      {selectedWorkflow.alasan_penolakan && (
                                        <div>
                                          <b>Alasan Penolakan:</b>{" "}
                                          {selectedWorkflow.alasan_penolakan}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogDescription>
                                <DialogClose asChild>
                                  <Button variant="outline">Tutup</Button>
                                </DialogClose>
                              </DialogHeader>
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
                          {showRejectDialog === wf.id && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                                <h3 className="text-lg font-semibold mb-2">
                                  Alasan Penolakan
                                </h3>
                                <textarea
                                  className="w-full border rounded p-2 mb-4"
                                  rows={3}
                                  placeholder="Tulis alasan penolakan..."
                                  value={rejectReason}
                                  onChange={(e) =>
                                    setRejectReason(e.target.value)
                                  }
                                />
                                <div className="flex justify-end space-x-2">
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
                                </div>
                              </div>
                            </div>
                          )}
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
