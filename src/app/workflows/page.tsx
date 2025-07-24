"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Search,
  Download,
  Users,
  Star,
  // Filter, // Category filter disabled
  ArrowRight,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
// import { workflowCategories } from "@/data/category-workflows"; // Category filter disabled
import GradientCircle from "@/components/GradientCircle";

type WorkflowWithProfileName = {
  profile_id: string;
  [key: string]: any;
  profile_name?: string;
  profile_image?: string | null;
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Category filter disabled
  // const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const workflowsPerPage = 8;
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchWorkflows(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchWorkflows = async (page = 1) => {
    setLoading(true);

    try {
      // Gunakan API endpoint yang sudah diperbaiki
      const response = await fetch("/api/workflows");
      if (response.ok) {
        const data = await response.json();
        const workflowsData = data.workflows || [];

        // Mapping data untuk kompatibilitas
        const workflowsWithName: WorkflowWithProfileName[] = workflowsData.map(
          (w: any) => ({
            ...w,
            profile_name: w.profile_name || "-",
            profile_image: w.profile_image || null,
            profile_id: w.profile_id,
          })
        );

        setWorkflows(workflowsWithName);
        console.log("Workflows data:", workflowsWithName);
        console.log(
          "Workflows with json_n8n:",
          workflowsWithName.filter((w) => w.json_n8n)
        );
        console.log(
          "Sample workflow json_n8n:",
          workflowsWithName[0]?.json_n8n
        );
      } else {
        console.error("Failed to fetch workflows");
        setWorkflows([]);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.tags || []).some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    // Category filter disabled - always return true for category
    // const matchesCategory =
    //   categoryFilter === "All" || w.category === categoryFilter;
    const matchesCategory = true; // Always show all categories
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
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-12">
      <button
        className="px-3 sm:px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-xs sm:text-sm"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow text-xs sm:text-sm min-w-[32px] sm:min-w-[40px]
              ${
                page === currentPage
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
              }
            `}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="px-3 sm:px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-xs sm:text-sm"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="text-white content-above-gradient relative">
      {/* Gradient circle langsung di halaman */}
      <GradientCircle
        type="hero"
        style={{
          top: "20vh",
          left: "25vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      <div className="w-full container-box relative z-10 mb-32">
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-32 md:pt-64 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Heading */}
            <div className="flex flex-col items-start flex-shrink-0">
              <h1 className="hero-title-main">Explore</h1>
              <h2 className="hero-title-sub">Workflows</h2>
            </div>

            {/* Garis Penyambung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Deskripsi dan Search */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div className="hero-description max-w-3xl mb-6">
                Temukan beragam workflow N8N buatan kreator Indonesia, dari yang
                simpel hingga kompleks, untuk mempermudah pekerjaan Anda.
              </div>
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Cari Workflow"
                  className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Mobile: Deskripsi dan Search */}
          <div className="md:hidden flex flex-col items-start w-full mt-6">
            <div className="hero-description max-w-3xl mb-4">
              Temukan beragam workflow N8N buatan kreator Indonesia, dari yang
              simpel hingga kompleks, untuk mempermudah pekerjaan Anda.
            </div>
            {/* Search Bar Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari Workflow"
                className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="workflow-grid mt-32 mb-20 sm:mb-32 overflow-hidden">
          {loading ? (
            <div className="w-full text-center py-8 sm:py-12 text-white/60 text-sm sm:text-base break-words">
              Loading...
            </div>
          ) : paginatedWorkflows.length === 0 ? (
            <div className="w-full text-center py-8 sm:py-12 text-white/60 text-sm sm:text-base break-words">
              Tidak ada workflow ditemukan.
            </div>
          ) : (
            paginatedWorkflows.map((workflow) => (
              <Link
                key={workflow.id}
                href={`/workflows/${workflow.id}`}
                className="group relative rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 block overflow-hidden h-full"
              >
                {/* Div 1: Workflow Preview Diagram (Full Width) */}
                <div className="w-full relative workflow-preview-section overflow-hidden">
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-black text-white rounded-full">
                      {workflow.category || "General"}
                    </span>
                  </div>

                  {/* Workflow Diagram Preview */}
                  <div className="w-full -top-4 lg:top-0 absolute min-h-72">
                    <div className="bg-gray-50 border-b border-gray-200 workflow-preview-header">
                      {/* Div wrapper dengan posisi relative untuk workflow preview */}
                      <div className="h-full workflow-preview-wrapper">
                        <div className="workflow-preview-container workflow-preview-transform">
                          {workflow.json_n8n ? (
                            <div
                              className="workflow-preview-content absolute -translate-x-48  min-w-[1000px] h-full"
                              dangerouslySetInnerHTML={{
                                __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                                  /'/g,
                                  "&#39;"
                                )}' frame="true" style="width: 100%; height: 100%; border: none; border-radius: 0; margin: 0; padding: 0; overflow: hidden; display: block;"></n8n-demo>`,
                              }}
                            />
                          ) : (
                            <div className="workflow-preview-content absolute w-full h-full flex items-center justify-center bg-gray-100">
                              <div className="text-center text-gray-500">
                                <div className="text-2xl mb-1">📋</div>
                                <p className="text-xs">No workflow data</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  json_n8n field empty
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Add workflow JSON to see preview
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="btn-jelajah-workflow  flex items-center justify-center gap-3 rounded-full mt-[23px] max-w-[200px]">
                      Pelajari
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 19 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                          stroke="#622a9a"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                          stroke="black"
                          strokeOpacity="0.05"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Div 2: Content (Judul, Deskripsi, Tag, Creator) */}
                <div className="p-4 sm:p-6">
                  {/* Title */}
                  <h3 className="workflow-card-title group-hover:text-purple-700 transition-colors">
                    {workflow.title}
                    test
                  </h3>

                  {/* Description */}
                  <p className="workflow-card-description line-clamp-3">
                    {workflow.description ||
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {(workflow.tags || []).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium break-words"
                      >
                        {tag}
                      </span>
                    ))}
                    {(workflow.tags || []).length > 3 && (
                      <span className="px-2 sm:px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium">
                        +{(workflow.tags || []).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                      {workflow.profile_image ? (
                        <img
                          src={workflow.profile_image}
                          alt={workflow.profile_name || "Creator"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                          {workflow.profile_name?.charAt?.(0) || "C"}
                        </div>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-purple-900 font-medium break-words">
                      {workflow.profile_name || "Creator"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}
        <p className="text-white/60 text-xs sm:text-sm mt-8 sm:mt-12 mb-8 sm:mb-12 text-center break-words">
          {totalPages > 1
            ? `Showing page ${currentPage} of ${totalPages}`
            : `Showing all ${filteredWorkflows.length} workflows`}
        </p>
      </div>
    </div>
  );
}
