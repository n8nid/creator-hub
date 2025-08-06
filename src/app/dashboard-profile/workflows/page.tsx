"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown, Workflow } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkflowsSubPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null);
  const [myWorkflows, setMyWorkflows] = useState<any[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const workflowsPerPage: number = 9;

  // Handle resubmit workflow
  const handleResubmit = async (workflowId: string) => {
    if (!confirm("Yakin ingin mengajukan ulang workflow ini?")) return;

    try {
      const { error } = await supabase
        .from("workflows")
        .update({
          status: "pending",
          admin_notes: "", // Clear previous admin notes
        })
        .eq("id", workflowId);

      if (error) {
        alert(`Gagal mengajukan ulang workflow: ${error.message}`);
        return;
      }

      alert("Workflow berhasil diajukan ulang!");
      // Refresh the workflows list
      const { data } = await supabase
        .from("workflows")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });
      setMyWorkflows(data || []);
    } catch (err: any) {
      alert(err?.message || "Gagal mengajukan ulang workflow.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!profile?.id) return;
    const fetchMyWorkflows = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("workflows")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });
      setMyWorkflows(data || []);
      setFilteredWorkflows(data || []);
      setLoading(false);
    };
    fetchMyWorkflows();
  }, [profile]);

  // Filter and search workflows
  useEffect(() => {
    let filtered = [...myWorkflows];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (workflow) =>
          workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (workflow.tags || []).some((tag: string) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((workflow) =>
        workflow.tags?.includes(categoryFilter)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (workflow) => workflow.status === statusFilter
      );
    }

    // Default sort by updated_at (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    setFilteredWorkflows(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [myWorkflows, searchTerm, categoryFilter, statusFilter]);

  // Calculate pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredWorkflows.length / workflowsPerPage);
    const currentPageNum = parseInt(String(currentPage), 10);
    const startIndex = (currentPageNum - 1) * workflowsPerPage;
    const endIndex = startIndex + workflowsPerPage;
    const currentWorkflows = filteredWorkflows.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentWorkflows,
    };
  }, [filteredWorkflows.length, currentPage, workflowsPerPage]);

  const { totalPages, startIndex, endIndex, currentWorkflows } = paginationData;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</p>
        <p className="text-gray-600 mb-6">
          Silakan login untuk mengelola workflow Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-4 overflow-x-hidden">
      {/* Header Section */}
      <div className="px-2">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
          Workflow Saya
        </p>
        <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">
          Kelola workflow Anda
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4 mb-6 p-2 sm:p-4 bg-gray-50 rounded-lg mx-2 sm:mx-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari workflow..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 text-sm"
          />
        </div>

        {/* Filters and Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200 text-sm min-w-0">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">
                Semua Kategori
              </SelectItem>
              <SelectItem value="e-commerce" className="text-sm">
                E-commerce
              </SelectItem>
              <SelectItem value="communication" className="text-sm">
                Communication
              </SelectItem>
              <SelectItem value="data-management" className="text-sm">
                Data Management
              </SelectItem>
              <SelectItem value="analytics" className="text-sm">
                Analytics
              </SelectItem>
              <SelectItem value="finance" className="text-sm">
                Finance
              </SelectItem>
              <SelectItem value="marketing" className="text-sm">
                Marketing
              </SelectItem>
              <SelectItem value="operations" className="text-sm">
                Operations
              </SelectItem>
              <SelectItem value="hr" className="text-sm">
                HR
              </SelectItem>
              <SelectItem value="content" className="text-sm">
                Content
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200 text-sm min-w-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">
                Semua Status
              </SelectItem>
              <SelectItem value="draft" className="text-sm">
                Draft
              </SelectItem>
              <SelectItem value="pending" className="text-sm">
                Pending
              </SelectItem>
              <SelectItem value="approved" className="text-sm">
                Approved
              </SelectItem>
              <SelectItem value="rejected" className="text-sm">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Add Workflow Button */}
          <Link
            href="/dashboard-profile/workflows/add"
            className="btn-primary px-4 py-2 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Tambah Workflow</span>
            <span className="sm:hidden">Tambah</span>
          </Link>
        </div>
      </div>

      {/* Pagination Info */}
      {!loading && filteredWorkflows.length > 0 && (
        <div className="text-sm text-gray-600 mb-4 text-center px-4">
          <span className="break-words">
            Menampilkan {startIndex + 1}-
            {Math.min(endIndex, filteredWorkflows.length)} dari{" "}
            {filteredWorkflows.length} workflow
          </span>
        </div>
      )}

      {/* List workflow user */}
      {loading ? (
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-14"></div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
          {currentWorkflows.map((w) => (
            <Card
              key={w.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                (window.location.href = `/dashboard-profile/workflows/${w.id}`)
              }
            >
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {/* Category */}
                  {w.category && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-purple-900 text-white rounded-full break-words">
                        {w.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words line-clamp-2">
                    {w.title}
                  </h3>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full break-words">
                      {w.complexity || "-"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full break-words ${
                        w.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : w.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : w.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  {/* Admin Notes for Rejected Workflows */}
                  {w.status === "rejected" && w.admin_notes && (
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            className="h-3 w-3 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-red-700 line-clamp-2 break-words">
                            {w.admin_notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {(w.tags || []).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-full break-words"
                      >
                        {tag}
                      </span>
                    ))}
                    {(w.tags || []).length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-50 border border-gray-200 text-gray-500 rounded-full">
                        +{(w.tags || []).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span className="break-words">
                      Updated: {w.updated_at?.slice(0, 10)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <span>❤️</span>
                        <span>0</span>
                      </span>
                      {/* Resubmit Button for Rejected Workflows */}
                      {w.status === "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResubmit(w.id);
                          }}
                        >
                          Resubmit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredWorkflows.length === 0 && (
            <div className="text-gray-500 text-center col-span-full py-8 sm:py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 break-words">
                {myWorkflows.length === 0
                  ? "Belum ada workflow"
                  : "Tidak ada workflow yang cocok"}
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base break-words px-2">
                {myWorkflows.length === 0
                  ? "Mulai dengan menambahkan workflow pertama Anda"
                  : "Coba ubah filter atau kata kunci pencarian Anda"}
              </p>
              {myWorkflows.length === 0 && (
                <Button
                  asChild
                  className="bg-purple-900 hover:bg-purple-800 text-white w-full sm:w-auto"
                >
                  <Link href="/dashboard-profile/workflows/add">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">
                      Tambah Workflow Pertama
                    </span>
                    <span className="sm:hidden">Tambah Workflow</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 px-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm disabled:opacity-50 pagination-btn"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 sm:px-3 py-2 text-gray-500 text-xs sm:text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(page as number)}
                    className={
                      currentPage === page
                        ? "btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-[32px] sm:min-w-[40px] pagination-btn"
                        : "btn-secondary px-3 sm:px-4 py-2 text-xs sm:text-sm min-w-[32px] sm:min-w-[40px] pagination-btn"
                    }
                  >
                    {page}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm disabled:opacity-50 pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
