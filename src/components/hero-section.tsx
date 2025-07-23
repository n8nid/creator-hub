"use client";

import React from "react";
import { ArrowRight, Zap, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";

function getInitials(nameOrEmail: string) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const HeroSection = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchRoleAndProfile = async () => {
      if (user) {
        setIsUserAdmin(await isAdmin(user.id));
        // Ambil data profil user
        const { data } = await supabase
          .from("profiles")
          .select("name, profile_image")
          .eq("user_id", user.id)
          .single();
        setProfile(data);
      }
    };
    fetchRoleAndProfile();
  }, [user, isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update posisi cursor secara langsung untuk responsivitas maksimal
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsHovering(true);
      setIsTransitioning(false);
    }, 50);
  };

  const handleMouseLeave = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsHovering(false);
      setIsTransitioning(false);
    }, 50);
  };

  return (
    <section className="relative text-white overflow-visible content-above-gradient">
      <div className="w-full container-box relative z-10 mt-32 2xl:mt-36">
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-0 2xl:pt-20 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Title + Subtitle */}
            <div className="flex flex-col items-start flex-shrink-0">
              <h1 className="hero-title-main flex flex-wrap items-baseline gap-2">
                <span>N8N</span>
                <span>Indonesia</span>
              </h1>
              <h2 className="hero-title-sub">Community</h2>
              <p className="hero-subtitle">
                Temukan dan bagikan workflow automation yang powerful.
              </p>
            </div>

            {/* Tengah: Garis Penghubung */}
            <div className="hidden md:flex items-center flex-1 min-w-0 mx-8">
              <div className="h-0.5 flex-1 bg-white/40" />
            </div>

            {/* Kanan: Description */}
            <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
              <div className="hero-description max-w-3xl">
                Bergabunglah dengan komunitas N8N Indonesia dan tingkatkan
                produktivitas Anda.
              </div>
            </div>
          </div>

          {/* Mobile: Description */}
          <div className="md:hidden flex flex-col items-start w-full mt-6">
            <div className="hero-description max-w-3xl">
              Bergabunglah dengan komunitas N8N Indonesia dan tingkatkan
              produktivitas Anda.
            </div>
          </div>
        </div>
        {/* INSIGHT & BUTTONS */}
        <div className="w-full pt-[10rem] 2xl:pt-[15.625rem] flex flex-col items-center">
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <div className="2xl:px-[10rem] lg:px-[5rem] md:px-[3rem]">
              {/* Gradient overlay yang mengikuti cursor */}
              <div />
              {/* Content */}
              <div className="relative z-10">
                <h2 className="lg:text-start text-center">
                  <span className="hero-insight-text">
                    Dapatkan insight, workflow siap pakai, dan dukungan dari
                    komunitas yang aktif dan solutif. Workflow Hebat Dimulai
                    dari Sini.
                  </span>
                </h2>
                <div className="mt-[2.5rem] flex flex-col sm:flex-row md:justify-start justify-center gap-3 md:gap-6">
                  <a className="btn-primary" href="/workflows">
                    Jelajahi Workflow
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                  <a className="btn-secondary" href="/directory">
                    Temukan Creator
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
