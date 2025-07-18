"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GradientCircle from "@/components/GradientCircle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  ExternalLink,
  Linkedin,
  Instagram,
  Github,
  Globe,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Creator {
  id: string;
  name: string;
  experience_level: string;
  hourly_rate: number;
  location: string;
  bio: string;
  about_markdown?: string;
  linkedin_url?: string;
  instagram_url?: string;
  github_url?: string;
  website_url?: string;
  avatar_url?: string;
}

interface Workflow {
  id: string;
  title: string;
  description: string;
  category: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  downloads: number;
  stars: number;
  creator: {
    name: string;
  };
  tags?: string[];
}

export default function CreatorDetailPage() {
  const params = useParams();
  const creatorId = params.id as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const workflowsPerPage = 8;

  useEffect(() => {
    fetchCreatorData();
  }, [creatorId]);

  // Debug effect untuk melihat data creator
  useEffect(() => {
    if (creator) {
      console.log("Creator data:", creator);
      console.log("Social links check:", {
        linkedin: creator.linkedin_url,
        instagram: creator.instagram_url,
        github: creator.github_url,
        website: creator.website_url,
      });
    }
  }, [creator]);

  useEffect(() => {
    fetchWorkflows();
  }, [creatorId, searchTerm, currentPage]);

  const fetchCreatorData = async () => {
    try {
      // Fetch creator data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", creatorId)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        setCreator(null);
        return;
      }

      // Use profile data
      const combinedCreator: Creator = {
        id: profileData.id,
        name: profileData.name,
        experience_level: profileData.experience_level || "Unknown",
        hourly_rate: profileData.hourly_rate || 0,
        location: profileData.location || "",
        bio: profileData.bio || "",
        about_markdown: profileData.about_markdown || "",
        linkedin_url: profileData.linkedin,
        instagram_url: profileData.twitter,
        github_url: profileData.github,
        website_url: profileData.website,
        avatar_url: profileData.profile_image,
      };

      setCreator(combinedCreator);
    } catch (error) {
      console.error("Error fetching creator data:", error);
      setCreator(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      let query = supabase
        .from("workflows")
        .select("*")
        .eq("profile_id", creatorId);

      // Add search filter if search term exists
      if (searchTerm.trim()) {
        query = query.or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      // Get total count for pagination
      const { count } = await query;
      const total = count || 0;
      setTotalPages(Math.ceil(total / workflowsPerPage));

      // Get paginated results
      const { data, error } = await query
        .range(
          (currentPage - 1) * workflowsPerPage,
          currentPage * workflowsPerPage - 1
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Workflow fetch error:", error);
        setWorkflows([]);
        return;
      }

      setWorkflows(data || []);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      setWorkflows([]);
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      case "expert":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "automation":
        return "bg-blue-100 text-blue-800";
      case "integration":
        return "bg-green-100 text-green-800";
      case "data processing":
        return "bg-purple-100 text-purple-800";
      case "notification":
        return "bg-orange-100 text-orange-800";
      case "scheduling":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <GradientCircle
          type="hero"
          style={{
            top: "20vh",
            left: "25vw",
            transform: "translateX(-50%)",
            zIndex: -1,
          }}
        />
        <main className="flex-grow relative z-10">
          <div className="w-full px-16">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-700 rounded-lg mb-8"></div>
              <div className="h-32 bg-gray-700 rounded-lg mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <GradientCircle
          type="hero"
          style={{
            top: "20vh",
            left: "25vw",
            transform: "translateX(-50%)",
            zIndex: -1,
          }}
        />
        <main className="flex-grow relative z-10">
          <div className="w-full px-16">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-white mb-4">
                Creator tidak ditemukan
              </h1>
              <p className="text-gray-300">
                Creator yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <GradientCircle
        type="hero"
        style={{
          top: "20vh",
          left: "25vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />
      <main className="flex-grow relative z-10">
        <div className="w-full px-16 pt-12">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white hover:text-white/80 hover:bg-white/10 w-fit"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Creator
            </Button>
          </div>

          {/* Creator Profile Section */}
          <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
            {/* Left Side - Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-40 h-40">
                <AvatarImage src={creator.avatar_url} alt={creator.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-purple-500">
                  {creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Center - Name, Experience, Search */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white">
                  {creator.name}
                </h1>
                <Badge
                  className={`w-fit mt-2 ${getExperienceColor(
                    creator.experience_level
                  )}`}
                >
                  {creator.experience_level}
                </Badge>
              </div>

              {/* Search Workflow */}
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Cari workflow..."
                  className="w-full pl-4 pr-12 py-2 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>

            {/* Right Side - Bio and Social Links (With container) */}
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                {/* About Creator */}
                {creator.about_markdown && (
                  <div className="mb-6">
                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-white mb-4">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold text-white mb-3">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold text-white mb-2">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-300 mb-4 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-outside text-gray-300 mb-4 space-y-1 ml-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-outside text-gray-300 mb-4 space-y-1 ml-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-gray-300">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-white">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-white/90">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="bg-white/10 text-white px-2 py-1 rounded text-sm font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-white/10 text-white p-4 rounded-lg overflow-x-auto mb-4">
                              {children}
                            </pre>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="text-purple-300 hover:text-purple-200 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-purple-400 pl-4 italic text-white/70 mb-4">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {creator.about_markdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-4">
                  {creator.linkedin_url && (
                    <a
                      href={creator.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {creator.instagram_url && (
                    <a
                      href={creator.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                  {creator.github_url && (
                    <a
                      href={creator.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {creator.website_url && (
                    <a
                      href={creator.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <Globe className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Workflows Section */}
          <div className="space-y-6 mt-16">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Workflow ({workflows.length})
              </h2>
            </div>

            {workflows.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">
                  {searchTerm
                    ? "Tidak ada workflow yang sesuai dengan pencarian."
                    : "Belum ada workflow yang dipublikasikan."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {workflows.map((workflow) => (
                    <Link
                      key={workflow.id}
                      href={`/workflows/${workflow.id}`}
                      className="group relative rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden block"
                    >
                      {/* Content */}
                      <div className="p-6">
                        {/* Category Badge */}
                        <div className="flex justify-end mb-4">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-black text-white rounded-full">
                            {workflow.category || "General"}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="text-lg font-bold text-purple-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                          {workflow.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {workflow.description ||
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(workflow.tags || [])
                            .slice(0, 3)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          {(workflow.tags || []).length > 3 && (
                            <span className="px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium">
                              +{(workflow.tags || []).length - 3}
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {creator?.avatar_url ? (
                              <img
                                src={creator.avatar_url}
                                alt={creator.name || "Creator"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                {creator?.name?.charAt?.(0) || "C"}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-purple-900 font-medium">
                            {creator?.name || "Creator"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Info */}
                <div className="text-center mb-4">
                  <p className="text-gray-300 text-sm">
                    Showing page {currentPage} of {totalPages}
                  </p>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow
                          ${
                            page === currentPage
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105"
                              : "bg-white/10 text-white/80 hover:bg-white/20 text-white border border-white/20"
                          }
                        `}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
