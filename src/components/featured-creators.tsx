"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Award, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import CreatorCard from "@/components/creator-card";

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
      <section className="py-20 hero-bg-custom">
        <div className="container mx-auto px-4">
          <div className="flex flex-row items-center justify-between mb-16">
            <h2 className="text-6xl font-thin text-white">Meet the Creators</h2>
            <a
              href="/directory"
              className="btn-jelajah flex items-center gap-2 px-8 py-3 rounded-full text-white text-base font-medium bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 transition-all"
            >
              Temukan Creator
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
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-row items-center gap-6">
                <div className="w-40 h-40 bg-gray-500 rounded-full" />
                <div>
                  <div className="font-bold text-white text-xl mb-1">
                    John Hopkins
                  </div>
                  <div className="text-gray-300 text-base">
                    Lead Developer,
                    <br />
                    CEO
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
    <section className="py-20 hero-bg-custom">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between mb-16">
          <h2 className="text-6xl font-thin text-white">Meet the Creators</h2>
          <a
            href="/directory"
            className="btn-jelajah flex items-center gap-2 px-8 py-3 rounded-full text-white text-base font-medium bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 transition-all"
          >
            Temukan Creator
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
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {creators.length > 0
            ? creators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex flex-row items-center gap-6"
                >
                  <div className="w-40 h-40 bg-gray-500 rounded-full overflow-hidden flex items-center justify-center">
                    {creator.profile_image ? (
                      <img
                        src={creator.profile_image}
                        alt={creator.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xl mb-1">
                      {creator.name}
                    </div>
                    <div className="text-gray-300 text-base">
                      {creator.bio || "Lead Developer, CEO"}
                    </div>
                  </div>
                </div>
              ))
            : [...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-row items-center gap-6">
                  <div className="w-40 h-40 bg-gray-500 rounded-full" />
                  <div>
                    <div className="font-bold text-white text-xl mb-1">
                      John Hopkins
                    </div>
                    <div className="text-gray-300 text-base">
                      Lead Developer,
                      <br />
                      CEO
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
