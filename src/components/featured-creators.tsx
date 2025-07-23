"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Creator {
  id: string;
  name: string;
  profile_image: string | null;
  status: string;
  workflow_count: number;
  experience_level: string;
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

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

const FeaturedCreators = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCreators();
  }, []);

  const fetchFeaturedCreators = async () => {
    try {
      setLoading(true);

      // Menggunakan API yang sama dengan halaman creator
      const response = await fetch("/api/creators");
      let apiCreators = [];

      if (response.ok) {
        apiCreators = await response.json();
        console.log("Featured creators loaded:", apiCreators.length);
      } else {
        console.error("Failed to fetch creators from API");
      }

      // Ambil creator pertama (4 untuk mobile, 6 untuk desktop)
      const featuredCreators = apiCreators.slice(0, 6);
      setCreators(featuredCreators);
    } catch (error) {
      console.error("Error fetching featured creators:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="pt-[13.313rem] content-above-gradient">
        <div className="w-full container-box relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
            <h2 className="h2-title text-center md:text-start w-full">
              Meet the Creators
            </h2>
            <a href="/directory" className="btn-primary">
              Temukan Creator
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                  stroke="white"
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
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 tablet:gap-5 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="creator-item">
                <div className="creator-avatar">
                  <Avatar className="creator-avatar-image">
                    <AvatarFallback className="creator-avatar-fallback">
                      ?
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="creator-info">
                  <h3 className="creator-name">Loading...</h3>
                  <p className="creator-experience">Loading...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[13.313rem] content-above-gradient">
      <div className="w-full container-box relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
          <h2 className="h2-title text-center md:text-start w-full">
            Meet the Creators
          </h2>
          <a href="/directory" className="btn-primary">
            Temukan Creator
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                stroke="white"
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
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 tablet:gap-5 lg:gap-6">
          {creators.length > 0
            ? creators.slice(0, 4).map((creator) => (
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
            : [...Array(4)].map((_, i) => (
                <div key={i} className="creator-item">
                  <div className="creator-avatar">
                    <Avatar className="creator-avatar-image">
                      <AvatarFallback className="creator-avatar-fallback">
                        ?
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="creator-info">
                    <h3 className="creator-name">No Creators Found</h3>
                    <p className="creator-experience">No creators available</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;
