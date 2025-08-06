"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Search } from "lucide-react";
import Link from "next/link";
import GradientCircle from "@/components/GradientCircle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [displayedCreators, setDisplayedCreators] = useState(9);
  const [hasMore, setHasMore] = useState(false);
  const supabase = createClientComponentClient();

  const fetchCreators = async () => {
    try {
      setLoading(true);

      // Ambil data dari API
      const response = await fetch("/api/creators");
      let apiCreators = [];

      if (response.ok) {
        apiCreators = await response.json();
        console.log("API creators loaded:", apiCreators.length);
        setCreators(apiCreators);
      } else {
        console.error("Failed to fetch creators from API");
        setCreators([]);
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  // Filter creators based on search term
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch = creator.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get visible creators based on displayed count
  const visibleCreators = filteredCreators.slice(0, displayedCreators);

  // Check if there are more creators to show
  useEffect(() => {
    const filteredCount = filteredCreators.length;
    setHasMore(filteredCount > displayedCreators);
  }, [filteredCreators, displayedCreators]);

  // Handle load more
  const handleLoadMore = () => {
    setDisplayedCreators((prev) => prev + 9);
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

  return (
    <div className="text-white content-above-gradient relative">
      {/* Gradient circle langsung di halaman */}
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

      <div className="w-full container-box relative z-10 mb-32">
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-32 md:pt-64 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Heading */}
            <div className="flex flex-col items-start flex-shrink-0">
              <h1 className="hero-title-main">Explore</h1>
              <h2 className="hero-title-sub">Creator</h2>
            </div>

            {/* Garis Penyambung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Deskripsi dan Search */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div className="hero-description max-w-3xl mb-6">
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
            <div className="hero-description max-w-3xl mb-4">
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

        {/* Creators Grid - New Layout */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 gap-4 tablet:gap-5 lg:gap-6 mt-28 md:mt-32">
          {loading ? (
            <div className="col-span-full text-center py-12 text-white/60">
              Loading...
            </div>
          ) : visibleCreators.length === 0 ? (
            <div className="col-span-full text-center py-12 text-white/60">
              Tidak ada creator ditemukan.
            </div>
          ) : (
            visibleCreators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creators/${creator.id}`}
                className="block group"
              >
                <div className="creator-item">
                  <div className="creator-avatar">
                    <Avatar className="creator-avatar-image">
                      <AvatarImage
                        src={creator.profile_image || ""}
                        alt={creator.name}
                      />
                      <AvatarFallback className="creator-avatar-fallback">
                        {creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="creator-info">
                    <h3 className="creator-name">{creator.name}</h3>
                    <p className="creator-experience">
                      {formatExperienceLevel(creator.experience_level)}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-10 py-4 rounded-full font-medium bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <span>Load more</span>
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
      </div>
    </div>
  );
}
