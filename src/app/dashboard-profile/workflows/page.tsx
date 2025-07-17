"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown, Workflow } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [myWorkflows, setMyWorkflows] = useState<any[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const workflowsPerPage: number = 9;

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk mengelola workflow Anda.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari workflow..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 text-sm"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 bg-white border-gray-200 text-sm">
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
          <SelectTrigger className="w-40 bg-white border-gray-200 text-sm">
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
        <Button
          asChild
          className="bg-purple-900 hover:bg-purple-800 text-white text-sm"
        >
          <Link href="/dashboard-profile/workflows/add">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Workflow
          </Link>
        </Button>
      </div>

      {/* Pagination Info */}
      {!loading && filteredWorkflows.length > 0 && (
        <div className="text-sm text-gray-600 mb-4 text-center">
          Menampilkan {startIndex + 1}-
          {Math.min(endIndex, filteredWorkflows.length)} dari{" "}
          {filteredWorkflows.length} workflow
        </div>
      )}

      {/* List workflow user */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentWorkflows.map((w) => (
            <Card
              key={w.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                (window.location.href = `/dashboard-profile/workflows/${w.id}`)
              }
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900">{w.title}</h3>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                      {w.complexity || "-"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {(w.tags || []).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-full"
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
                    <span>Updated: {w.updated_at?.slice(0, 10)}</span>
                    <span className="flex items-center gap-1">
                      <span>❤️</span>
                      <span>0</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredWorkflows.length === 0 && (
            <div className="text-gray-500 text-center col-span-full py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {myWorkflows.length === 0
                  ? "Belum ada workflow"
                  : "Tidak ada workflow yang cocok"}
              </h3>
              <p className="text-gray-600 mb-6">
                {myWorkflows.length === 0
                  ? "Mulai dengan menambahkan workflow pertama Anda"
                  : "Coba ubah filter atau kata kunci pencarian Anda"}
              </p>
              {myWorkflows.length === 0 && (
                <Button
                  asChild
                  className="bg-purple-900 hover:bg-purple-800 text-white"
                >
                  <Link href="/dashboard-profile/workflows/add">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Workflow Pertama
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white disabled:opacity-50"
          >
            Previous
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page as number)}
                  className={
                    currentPage === page
                      ? "bg-purple-900 hover:bg-purple-800 text-white"
                      : "border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
                  }
                >
                  {page}
                </Button>
              )}
            </div>
          ))}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
