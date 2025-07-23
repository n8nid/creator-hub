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
  ChevronDown,
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
  complexity?: string;
  status?: string;
}

export default function CreatorDetailPage() {
  const params = useParams();
  const creatorId = params.id as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [displayedWorkflows, setDisplayedWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
    if (creator) {
      fetchWorkflows();
    }
  }, [creatorId, searchTerm, creator]);

  // Initialize displayed workflows when workflows change
  useEffect(() => {
    setDisplayedWorkflows(workflows.slice(0, workflowsPerPage));
  }, [workflows]);

  const fetchCreatorData = async () => {
    try {
      // Fetch creator data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", creatorId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setLoading(false);
        return;
      }

      // Debug log untuk melihat data profile
      console.log("Profile data:", profileData);
      console.log("Profile image:", profileData.profile_image);

      // Transform profile data to match Creator interface
      const creatorData: Creator = {
        id: profileData.id,
        name: profileData.name || "Unknown Creator",
        experience_level: profileData.experience_level || "beginner",
        hourly_rate: profileData.hourly_rate || 0,
        location: profileData.location || "Unknown",
        bio: profileData.bio || "",
        about_markdown: profileData.about_markdown || "",
        linkedin_url: profileData.linkedin || "",
        instagram_url: profileData.instagram || "",
        github_url: profileData.github || "",
        website_url: profileData.website || "",
        avatar_url: profileData.profile_image || "",
      };

      console.log("Creator data:", creatorData);
      console.log("Avatar URL:", creatorData.avatar_url);

      setCreator(creatorData);
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchCreatorData:", error);
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      let query = supabase
        .from("workflows")
        .select("*")
        .eq("profile_id", creatorId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      // Add search filter if searchTerm exists
      if (searchTerm.trim()) {
        query = query.or(
          `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching workflows:", error);
        return;
      }

      // Transform data to match our interface
      const transformedWorkflows = (data || []).map((workflow: any) => ({
        id: workflow.id,
        title: workflow.title,
        description: workflow.description,
        category: workflow.complexity || "General", // Use complexity as category
        creator_id: workflow.profile_id,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at,
        downloads: 0, // Default value since not in schema
        stars: 0, // Default value since not in schema
        creator: {
          name: creator?.name || "Unknown Creator",
        },
        tags: workflow.tags || [],
        complexity: workflow.complexity,
        status: workflow.status,
      }));

      setWorkflows(transformedWorkflows);
    } catch (error) {
      console.error("Error in fetchWorkflows:", error);
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "automation":
        return "bg-blue-100 text-blue-800";
      case "integration":
        return "bg-purple-100 text-purple-800";
      case "data":
        return "bg-green-100 text-green-800";
      case "marketing":
        return "bg-pink-100 text-pink-800";
      case "productivity":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLoadMore = () => {
    const nextBatch = workflows.slice(
      displayedWorkflows.length,
      displayedWorkflows.length + workflowsPerPage
    );
    setDisplayedWorkflows([...displayedWorkflows, ...nextBatch]);
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
          <div className="w-full container-box">
            <div className="animate-pulse">
              <div className="h-48 sm:h-64 bg-gray-700 rounded-lg mb-6 sm:mb-8"></div>
              <div className="h-24 sm:h-32 bg-gray-700 rounded-lg mb-6 sm:mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-36 sm:h-48 bg-gray-700 rounded-lg"
                  ></div>
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
          <div className="w-full container-box">
            <div className="text-center py-8 sm:py-12 px-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 break-words">
                Creator tidak ditemukan
              </h1>
              <p className="text-gray-300 text-sm sm:text-base break-words">
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
          top: "10vh",
          left: "25vw",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      {/* Gradient circle kedua di area kanan */}
      <GradientCircle
        type="hero"
        style={{
          top: "75vh",
          left: "80vw",
          transform: "translateX(50%)",
          zIndex: -1,
        }}
      />

      <main className="flex-grow relative z-10">
        <div className="w-full container-box pt-40 sm:pt-48">
          {/* Creator Profile Section */}
          <div className="creator-detail-profile-section mb-6 sm:mb-8">
            {/* Left Side - Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="creator-detail-avatar">
                <AvatarImage
                  src={creator.avatar_url}
                  alt={creator.name}
                  onError={(e) => {
                    console.log(
                      "Avatar image failed to load:",
                      creator.avatar_url
                    );
                    e.currentTarget.style.display = "none";
                  }}
                />
                <AvatarFallback className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-br from-purple-500 to-purple-500">
                  {creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Center - Name, Experience, Search */}
            <div className="flex-1 min-w-0 creator-detail-content">
              <div className="text-left creator-detail-name-section">
                <h1 className="creator-detail-name break-words">
                  {creator.name}
                </h1>
                <div className="creator-detail-experience mt-2">
                  {creator.experience_level}
                </div>
              </div>

              {/* Search Workflow */}
              <div className="creator-detail-search-container">
                <input
                  type="text"
                  placeholder="Cari workflow..."
                  className="creator-detail-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="creator-detail-search-icon" />
              </div>
            </div>

            {/* Right Side - Bio and Social Links (Without container) */}
            <div className="flex-1 w-full lg:w-auto creator-detail-bio-section">
              {/* About Creator */}
              {creator.about_markdown && (
                <div className="mb-4 sm:mb-6">
                  <div className="hero-description">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="hero-description font-bold mb-3 sm:mb-4 break-words">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="hero-description font-bold mb-2 sm:mb-3 break-words">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="hero-description font-bold mb-2 break-words">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="hero-description mb-3 sm:mb-4 break-words">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="hero-description list-disc list-outside mb-3 sm:mb-4 space-y-1 ml-3 sm:ml-4">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="hero-description list-decimal list-outside mb-3 sm:mb-4 space-y-1 ml-3 sm:ml-4">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="hero-description break-words">
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="hero-description font-bold break-words">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="hero-description italic break-words">
                            {children}
                          </em>
                        ),
                        code: ({ children }) => (
                          <code className="hero-description bg-white/10 px-2 py-1 rounded font-mono break-words">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="hero-description bg-white/10 p-3 sm:p-4 rounded-lg overflow-x-auto mb-3 sm:mb-4">
                            {children}
                          </pre>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            className="hero-description text-purple-300 hover:text-purple-200 underline break-words"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="hero-description border-l-4 border-purple-400 pl-3 sm:pl-4 italic mb-3 sm:mb-4 break-words">
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
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                {creator.linkedin_url && (
                  <a
                    href={creator.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.instagram_url && (
                  <a
                    href={creator.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.github_url && (
                  <a
                    href={creator.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.website_url && (
                  <a
                    href={creator.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Workflows Section */}
          <div className="space-y-12 sm:space-y-16 mt-28 sm:mt-32">
            {/* Search Bar for Mobile and Tablet - Above Workflows */}
            <div className="block creator-detail-search-container-tablet">
              <div className="relative w-full max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Cari workflow..."
                  className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              </div>
            </div>
            {workflows.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-2">
                <p className="text-gray-300 text-base sm:text-lg break-words">
                  {searchTerm
                    ? "Tidak ada workflow yang sesuai dengan pencarian."
                    : "Belum ada workflow yang dipublikasikan."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {displayedWorkflows.map((workflow) => (
                    <Link
                      key={workflow.id}
                      href={`/workflows/${workflow.id}`}
                      className="group relative rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden block"
                    >
                      {/* Content */}
                      <div className="p-4 sm:p-6">
                        {/* Category Badge */}
                        <div className="flex justify-end mb-4">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-black text-white rounded-full">
                            {workflow.category || "General"}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors break-words">
                          {workflow.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed break-words">
                          {workflow.description ||
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                          {(workflow.tags || [])
                            .slice(0, 3)
                            .map((tag: string) => (
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

                        {/* Stats */}
                        <div className="flex items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                            {creator?.avatar_url ? (
                              <img
                                src={creator.avatar_url}
                                alt={creator.name || "Creator"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                                {creator?.name?.charAt?.(0) || "C"}
                              </div>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-purple-900 font-medium break-words">
                            {creator?.name || "Creator"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More Button */}
                {workflows.length > displayedWorkflows.length && (
                  <div className="flex justify-center mt-12 sm:mt-16">
                    <button
                      onClick={handleLoadMore}
                      className="px-10 py-4 rounded-full font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                    >
                      <span>Load More</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17l9.2-9.2M17 17V7H7"
                        />
                      </svg>
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
