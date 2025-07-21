"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Award, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Creator {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  skills: string[] | null;
  experience_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  profile_image: string | null;
  hourly_rate: number | null;
  availability: "available" | "busy" | "unavailable" | null;
  status: "draft" | "pending" | "approved" | "rejected";
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const FeaturedCreators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCreators();
  }, []);

  const fetchFeaturedCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching featured creators:", error);
        return;
      }

      setCreators(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 content-above-gradient">
        <div className="w-full px-4 sm:px-8 md:px-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight text-white text-left"
              style={{
                fontFamily: "Albert Sans, Arial, sans-serif",
                letterSpacing: 0,
              }}
            >
              Meet the Creators
            </h2>
            <a
              href="/directory"
              className="btn-jelajah flex items-center justify-center gap-3 px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 w-full sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              Temukan Creator
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                  <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-white text-lg sm:text-xl mb-1">
                    Loading...
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base">Loading...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 content-above-gradient">
      <div className="w-full px-4 sm:px-8 md:px-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight text-white text-left"
            style={{
              fontFamily: "Albert Sans, Arial, sans-serif",
              letterSpacing: 0,
            }}
          >
            Meet the Creators
          </h2>
          <a
            href="/directory"
            className="btn-jelajah flex items-center justify-center gap-3 px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 w-full sm:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Temukan Creator
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {creators.length > 0
            ? creators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
                >
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                    <AvatarImage
                      src={creator.profile_image || undefined}
                      alt={creator.name}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                      {getInitials(creator.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-white text-lg sm:text-xl mb-1">
                      {creator.name}
                    </div>
                    <div className="text-gray-300 text-sm sm:text-base">
                      {creator.bio || "Lead Developer, CEO"}
                    </div>
                  </div>
                </div>
              ))
            : [...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                    <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                      ?
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <div className="font-bold text-white text-lg sm:text-xl mb-1">
                      No Creators Found
                    </div>
                    <div className="text-gray-300 text-sm sm:text-base">
                      No creators available
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;
