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

      // Ambil user_id yang sudah approved di creator_applications
      const { data: approvedUsers, error: approvedUsersError } = await supabase
        .from("creator_applications")
        .select("user_id")
        .eq("status", "approved");

      if (approvedUsersError) {
        console.error("Error fetching approved users:", approvedUsersError);
        return;
      }

      if (!approvedUsers || approvedUsers.length === 0) {
        console.log("No approved creators found");
        setCreators([]);
        return;
      }

      const approvedUserIds = approvedUsers.map((app) => app.user_id);

      // Ambil profiles dari user yang sudah approved di creator_applications
      const { data: creators, error: creatorsError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", approvedUserIds)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);

      if (creatorsError) {
        console.error("Error fetching creators:", creatorsError);
        return;
      }

      setCreators(creators || []);
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
          <div className="flex flex-col items-start justify-start mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
              <h2 className="explore-workflow-title text-white flex-1 min-w-0">
                Meet the Creators
              </h2>
              <a
                href="/directory"
                className="btn-jelajah button-text flex items-center gap-3 w-full sm:w-auto justify-center button-height-60"
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
          </div>
          <div className="flex flex-row gap-8 justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-row items-center gap-6">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0">
                  <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="creator-name-text mb-2 break-words">
                    Loading...
                  </div>
                  <div className="creator-description-text break-words">
                    Loading...
                  </div>
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
        <div className="flex flex-col items-start justify-start mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
            <h2 className="explore-workflow-title text-white flex-1 min-w-0">
              Meet the Creators
            </h2>
            <a
              href="/directory"
              className="btn-jelajah button-text flex items-center gap-3 w-full sm:w-auto justify-center button-height-60"
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
        </div>

        <div className="flex flex-row gap-8 justify-center">
          {creators.length > 0
            ? creators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex flex-row items-center gap-6"
                >
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0">
                    <AvatarImage
                      src={creator.profile_image || undefined}
                      alt={creator.name}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                      {getInitials(creator.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="creator-name-text mb-2 break-words">
                      {creator.name}
                    </div>
                    <div className="creator-description-text break-words">
                      {creator.bio || "Lead Developer, CEO"}
                    </div>
                  </div>
                </div>
              ))
            : [...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-row items-center gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0">
                    <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                      ?
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="creator-name-text mb-2 break-words">
                      No Creators Found
                    </div>
                    <div className="creator-description-text break-words">
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
