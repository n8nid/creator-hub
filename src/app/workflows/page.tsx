"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Search,
  Download,
  Users,
  Star,
  Filter,
  ArrowRight,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";

const categories = [
  "All",
  "E-commerce",
  "Communication",
  "Data Management",
  "Analytics",
  "Finance",
  "Marketing",
  "Operations",
  "HR",
  "Content",
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const workflowsPerPage = 12;
  const supabase = createClientComponentClient();

  // Data dummy workflows untuk testing pagination
  const dummyWorkflows = Array.from({ length: 15 }, (_, i) => ({
    id: `dummy-${i + 1}`,
    title: `Dummy Workflow ${i + 1}`,
    description: `Deskripsi workflow dummy ke-${
      i + 1
    }. Ini hanya data testing untuk pagination.`,
    category: [
      "E-Commerce",
      "Automation",
      "Analytics",
      "Marketing",
      "Finance",
      "Content",
    ][i % 6],
    tags: ["dummy", `tag${i + 1}`],
    nodes: Math.floor(Math.random() * 10) + 1,
    downloads: Math.floor(Math.random() * 100),
    profile: { name: `Dummy Creator ${i + 1}` },
    screenshot_url: null,
    video_url: null,
    complexity: ["simple", "medium", "complex"][i % 3],
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  useEffect(() => {
    fetchWorkflows(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchWorkflows = async (page = 1) => {
    setLoading(true);
    const from = (page - 1) * workflowsPerPage;
    const to = from + workflowsPerPage - 1;
    // Fetch workflows for current page
    const { data, error, count } = await supabase
      .from("workflows")
      .select("*, profile:profiles(name)", { count: "exact" })
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, to);
    if (!error) {
      setWorkflows(data || []);
      // Fetch total count for pagination
      if (typeof count === "number") {
        // setTotalPages(Math.ceil(count / workflowsPerPage)); // This line is removed
      }
    }
    setLoading(false);
  };

  // Gabungkan data workflows dari Supabase dan dummy
  const allWorkflows = [...workflows, ...dummyWorkflows];

  const filteredWorkflows = allWorkflows.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.tags || []).some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === "All" || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Hitung total halaman dari filteredWorkflows
  const totalPages = Math.max(
    1,
    Math.ceil(filteredWorkflows.length / workflowsPerPage)
  );

  // Ambil data sesuai halaman aktif
  const paginatedWorkflows = filteredWorkflows.slice(
    (currentPage - 1) * workflowsPerPage,
    currentPage * workflowsPerPage
  );

  // Reset currentPage jika filter/search mengurangi jumlah halaman
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // Pagination component
  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow
            ${
              page === currentPage
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
            }
          `}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Workflow className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Semua Workflow
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Temukan dan gunakan workflow automation yang telah dibuat oleh
              komunitas N8N Indonesia
            </p>
            <div className="flex justify-center items-center gap-8 mt-8 text-purple-200">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {workflows.length} Workflows
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">- Contributors</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">- Downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari workflow berdasarkan nama, kategori, atau tag..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  categoryFilter === category
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md"
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              Loading...
            </div>
          ) : paginatedWorkflows.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No workflows found.
            </div>
          ) : (
            paginatedWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-pink-50/0 group-hover:from-purple-50/50 group-hover:to-pink-50/30 transition-all duration-300 rounded-2xl"></div>

                <div className="relative z-10">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full">
                      {workflow.category || "-"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-medium text-gray-600">
                        4.8
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Workflow className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {workflow.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {workflow.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">
                        {workflow.nodes || "-"} nodes
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span className="font-medium">
                        {workflow.downloads || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(workflow.tags || []).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-white border border-gray-200 text-gray-700 rounded-full hover:border-purple-300 hover:text-purple-700 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Author and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {/* In real app, ambil dari relasi profile/creator */}
                        {workflow.profile?.name?.charAt?.(0) || "C"}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {workflow.profile?.name || "Creator"}
                      </span>
                    </div>
                    <Link
                      href={`/workflows/${workflow.id}`}
                      className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-semibold group-hover:gap-2 transition-all"
                    >
                      <span>View</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}
        <p className="text-gray-500 text-sm mt-4 text-center">
          Showing page {currentPage} of {totalPages}
        </p>
      </div>
    </>
  );
}
