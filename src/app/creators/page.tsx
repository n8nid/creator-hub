"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Search, CheckCircle, Filter } from "lucide-react";
import Link from "next/link";
import GradientCircle from "@/components/GradientCircle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Creator {
  id: string;
  name: string;
  profile_image: string | null;
  status: string;
  workflow_count: number;
  experience_level: string;
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const creatorsPerPage = 9;
  const supabase = createClientComponentClient();

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/creators");
      if (response.ok) {
        const data = await response.json();
        setCreators(data);
      } else {
        console.error("Failed to fetch creators");
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  // Filter creators based on search term and experience level
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch = creator.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesExperience =
      experienceFilter === "all" ||
      creator.experience_level === experienceFilter;
    return matchesSearch && matchesExperience;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCreators.length / creatorsPerPage);
  const startIndex = (currentPage - 1) * creatorsPerPage;
  const endIndex = startIndex + creatorsPerPage;
  const paginatedCreators = filteredCreators.slice(startIndex, endIndex);

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Helper function to get experience level badge styling
  const getExperienceBadgeStyle = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "expert":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper function to format experience level text
  const formatExperienceLevel = (level: string) => {
    switch (level) {
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      case "expert":
        return "Expert";
      default:
        return "Unknown";
    }
  };

  // Helper function to get filter display text
  const getFilterDisplayText = () => {
    switch (experienceFilter) {
      case "all":
        return "All Experience Levels";
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      case "expert":
        return "Expert";
      default:
        return "All Experience Levels";
    }
  };

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
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
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

      <div className="w-full px-16 relative z-10">
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-8 md:pt-16 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Heading */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <h1 className="font-sans font-semibold text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-white mb-0 text-left">
                Explore
              </h1>
              <h2 className="font-sans font-thin text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white mb-0 text-left">
                Creator
              </h2>
            </div>

            {/* Garis Penyambung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Deskripsi dan Search */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "18px",
                  lineHeight: "150%",
                  letterSpacing: "-0.01em",
                  color: "#FFFFFF",
                  marginBottom: "24px",
                  textAlign: "left",
                }}
              >
                Kenalan dengan kreator N8N Indonesia yang rutin berbagi
                workflow, tips, dan ide automasi. Temukan inspirasi untuk
                project automasimu!
              </div>
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Cari Creator"
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
            <div
              style={{
                fontFamily: "Inter, Arial, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              Kenalan dengan kreator N8N Indonesia yang rutin berbagi workflow,
              tips, dan ide automasi. Temukan inspirasi untuk project
              automasimu!
            </div>
            {/* Search Bar Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari Creator"
                className="w-full pl-4 pr-12 py-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/10 hover:bg-white/20 transition-colors text-lg text-white placeholder-white/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col items-center justify-center mt-12 mb-8 gap-2">
          <div className="flex flex-row items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {getFilterDisplayText()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200">
                <DropdownMenuItem onClick={() => setExperienceFilter("all")}>
                  All Experience Levels
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setExperienceFilter("beginner")}
                >
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setExperienceFilter("intermediate")}
                >
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setExperienceFilter("advanced")}
                >
                  Advanced
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setExperienceFilter("expert")}>
                  Expert
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-white/60 text-sm text-center">
            {filteredCreators.length} creator
            {filteredCreators.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-2 tablet:gap-4 mt-16">
          {loading ? (
            <div className="col-span-full text-center py-12 text-white/60">
              Loading...
            </div>
          ) : paginatedCreators.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/60">
              Tidak ada creator ditemukan.
            </div>
          ) : (
            paginatedCreators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creators/${creator.id}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl p-4 tablet:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 max-w-sm tablet:max-w-none mx-auto w-full">
                  <div className="flex items-center space-x-4 tablet:space-x-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={creator.profile_image || ""}
                        alt={creator.name}
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 tablet:gap-3">
                        <h3 className="text-purple-900 font-semibold text-lg tablet:text-base break-words line-clamp-2 overflow-hidden group-hover:text-purple-700 transition-colors">
                          {creator.name}
                        </h3>
                        <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-purple-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-500 text-sm break-words line-clamp-1 overflow-hidden">
                          {creator.workflow_count} workflow
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-1 ${getExperienceBadgeStyle(
                            creator.experience_level
                          )}`}
                        >
                          {formatExperienceLevel(creator.experience_level)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}
        <p className="text-white/60 text-sm mt-8 text-center">
          Showing page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  );
}
