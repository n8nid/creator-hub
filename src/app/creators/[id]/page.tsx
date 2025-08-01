"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
  Twitter,
  Youtube,
  Mail,
} from "lucide-react";
import { FaDiscord, FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/lib/auth-context";

interface Creator {
  id: string;
  name: string;
  experience_level: string;
  hourly_rate: number;
  location: string;
  bio: string;
  about_markdown?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  website?: string;
  twitter?: string;
  threads?: string;
  discord?: string;
  Whatsapp?: string;
  youtube?: string;
  avatar_url?: string;
  email?: string;
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
  json_n8n?: string;
  screenshot_url?: string;
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
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [creatorEmail, setCreatorEmail] = useState<string>("");
  // Menggunakan supabase yang sudah diimport dari @/lib/supabase
  
  // Helper function untuk memformat nomor WhatsApp untuk link wa.me
  const formatWhatsAppForLink = (whatsappNumber: string): string => {
    if (!whatsappNumber) return '';
    
    const cleanNumber = whatsappNumber.replace(/\s/g, '');
    
    // Jika sudah dalam format 62xxx, hapus semua non-digit
    if (/^62[0-9]+$/.test(cleanNumber)) {
      return cleanNumber;
    }
    
    // Jika dalam format +62xxx, hapus + dan semua non-digit
    if (/^\+62[0-9]+$/.test(cleanNumber)) {
      return cleanNumber.replace(/\D/g, '');
    }
    
    // Jika dalam format 08xxx, ubah ke 62xxx
    if (/^08[0-9]+$/.test(cleanNumber)) {
      return '62' + cleanNumber.substring(1);
    }
    
    // Fallback: hapus semua non-digit
    return cleanNumber.replace(/\D/g, '');
  };

  useEffect(() => {
    fetchCreatorData();
  }, [creatorId]);

  // Debug effect untuk melihat data creator
  useEffect(() => {
    if (creator) {
      console.log("Creator data:", creator);
      console.log("Social links check:", {
        linkedin: creator.linkedin,
        instagram: creator.instagram,
        github: creator.github,
        website: creator.website,
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
      // Check if current user is admin
      if (user) {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setIsAdmin(!!adminData);
      }

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

      // Fetch creator's email from auth.users table (admin only)
      if (isAdmin && profileData.user_id) {
        const { data: userData } = await supabase
          .from("users")
          .select("email")
          .eq("id", profileData.user_id)
          .single();

        if (userData) {
          setCreatorEmail(userData.email);
        }
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
        linkedin: profileData.linkedin || "",
        instagram: profileData.instagram || "",
        github: profileData.github || "",
        website: profileData.website || "",
        twitter: profileData.twitter || "",
        threads: profileData.threads || "",
        discord: profileData.discord || "",
        Whatsapp: profileData.Whatsapp || "",
        youtube: profileData.youtube || "",
        avatar_url: profileData.profile_image || "",
        email: profileData.email || "",
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
        json_n8n: workflow.json_n8n, // Add json_n8n field for workflow preview
        screenshot_url: workflow.screenshot_url,
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

              {/* Email - Admin Only */}
              {isAdmin && creatorEmail && (
                <div className="flex items-center justify-center lg:justify-start text-white/80 text-xs mb-4">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="break-all">{creatorEmail}</span>
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs border-white/30 text-white/80"
                  >
                    Admin View
                  </Badge>
                </div>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                {creator.linkedin && (
                  <a
                    href={creator.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.twitter && (
                  <a
                    href={creator.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.github && (
                  <a
                    href={creator.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.instagram && (
                  <a
                    href={creator.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.threads && (
                  <a
                    href={creator.threads}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18.5A8.5 8.5 0 1 1 12 3.5a8.5 8.5 0 0 1 0 17Zm.25-13.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Zm-2.5 2.5a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm5 0a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm-2.5 8.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </a>
                )}
                {creator.discord && (
                  <a
                    href={creator.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <FaDiscord className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.Whatsapp && (
                  <a
                    href={`https://wa.me/${formatWhatsAppForLink(creator.Whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.youtube && (
                  <a
                    href={creator.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                )}
                {creator.website && (
                  <a
                    href={creator.website}
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
            <div className="block lg:hidden creator-detail-search-container-tablet">
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
                <div className="workflow-grid mt-8 mb-20 sm:mb-32 overflow-hidden">
                  {displayedWorkflows.map((workflow) => (
                    // <Link
                    //   key={workflow.id}
                    //   href={`/workflows/${workflow.id}`}
                    //   className="group relative rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden block workflow-card"
                    // >
                    //   {/* Div 1: Workflow Preview Diagram (Full Width) */}
                    //   <div className="w-full relative h-[45%] overflow-hidden">
                    //     {/* Category Badge */}
                    //     <div className="absolute top-4 right-4 z-10">
                    //       <span className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-black text-white rounded-full">
                    //         {workflow.category || "General"}
                    //       </span>
                    //     </div>

                    //     {/* Workflow Diagram Preview */}
                    //     <div className="w-full top-0 absolute min-h-96">
                    //       <div className="bg-gray-50 border-b border-gray-200 workflow-preview-header">
                    //         {/* Div wrapper dengan posisi relative untuk workflow preview */}
                    //         <div className="h-full workflow-preview-wrapper">
                    //           <div className="bg-red-500 workflow-preview-container -translate-x-36 -translate-y-10">
                    //             {workflow.json_n8n ? (
                    //               <div
                    //                 className="workflow-preview-content absolute w-full h-full"
                    //                 dangerouslySetInnerHTML={{
                    //                   __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                    //                     /'/g,
                    //                     "&#39;"
                    //                   )}' frame="true" style="width: 100%; height: 100%; border: none; border-radius: 0; margin: 0; padding: 0; overflow: hidden; display: block;"></n8n-demo>`,
                    //                 }}
                    //               />
                    //             ) : (
                    //               <div className="workflow-preview-content absolute w-full h-full flex items-center justify-center bg-gray-100">
                    //                 <div className="text-center text-gray-500">
                    //                   <div className="text-2xl mb-1">📋</div>
                    //                   <p className="text-xs">
                    //                     No workflow data
                    //                   </p>
                    //                   <p className="text-xs text-gray-400 mt-1">
                    //                     json_n8n field empty
                    //                   </p>
                    //                   <p className="text-xs text-gray-400 mt-1">
                    //                     Add workflow JSON to see preview
                    //                   </p>
                    //                 </div>
                    //               </div>
                    //             )}
                    //           </div>
                    //         </div>
                    //       </div>
                    //     </div>
                    //     <div className="absolute top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    //       <span className="btn-jelajah-workflow w-full flex items-center justify-center gap-3 sm:w-fit rounded-full mt-[23px] min-w-[200px]">
                    //         Pelajari
                    //         <svg
                    //           width="19"
                    //           height="20"
                    //           viewBox="0 0 19 20"
                    //           fill="none"
                    //           xmlns="http://www.w3.org/2000/svg"
                    //         >
                    //           <path
                    //             d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                    //             stroke="#622a9a"
                    //             strokeWidth="2"
                    //             strokeLinecap="round"
                    //             strokeLinejoin="round"
                    //           />
                    //           <path
                    //             d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                    //             stroke="black"
                    //             strokeOpacity="0.05"
                    //             strokeWidth="2"
                    //             strokeLinecap="round"
                    //             strokeLinejoin="round"
                    //           />
                    //         </svg>
                    //       </span>
                    //     </div>
                    //   </div>

                    //   {/* Div 2: Content (Judul, Deskripsi, Tag, Creator) */}
                    //   <div className="p-4 sm:p-6">
                    //     {/* Title */}
                    //     <h3 className="workflow-card-title group-hover:text-purple-700 transition-colors">
                    //       {workflow.title}
                    //     </h3>

                    //     {/* Description */}
                    //     <p className="workflow-card-description line-clamp-3">
                    //       {workflow.description ||
                    //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                    //     </p>

                    //     {/* Tags */}
                    //     <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    //       {(workflow.tags || [])
                    //         .slice(0, 3)
                    //         .map((tag: string) => (
                    //           <span
                    //             key={tag}
                    //             className="px-2 sm:px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium break-words"
                    //           >
                    //             {tag}
                    //           </span>
                    //         ))}
                    //       {(workflow.tags || []).length > 3 && (
                    //         <span className="px-2 sm:px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium">
                    //           +{(workflow.tags || []).length - 3}
                    //         </span>
                    //       )}
                    //     </div>

                    //     {/* Author */}
                    //     <div className="flex items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                    //       <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                    //         {creator?.avatar_url ? (
                    //           <img
                    //             src={creator.avatar_url}
                    //             alt={creator.name || "Creator"}
                    //             className="w-full h-full object-cover"
                    //           />
                    //         ) : (
                    //           <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                    //             {creator?.name?.charAt?.(0) || "C"}
                    //           </div>
                    //         )}
                    //       </div>
                    //       <span className="text-xs sm:text-sm text-purple-900 font-medium break-words">
                    //         {creator?.name || "Creator"}
                    //       </span>
                    //     </div>
                    //   </div>
                    // </Link>
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
                                {workflow.screenshot_url ? (
                                  <div className="workflow-preview-content absolute w-full h-full">
                                    <img
                                      src={workflow.screenshot_url}
                                      alt={`Preview workflow ${workflow.title}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : workflow.json_n8n ? (
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
                                      <p className="text-xs">
                                        No workflow data
                                      </p>
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

                        {/* Author */}
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
