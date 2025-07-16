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
    <section className="relative min-h-screen text-white overflow-visible content-above-gradient">
      <div className="w-full px-16 relative z-10">
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-12 md:pt-20 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-center w-full">
            {/* Kiri: Heading, Community, dan Deskripsi */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <h1 className="font-sans font-semibold text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-white mb-0 text-left">
                N8N Indonesia
              </h1>
              <div className="font-sans font-thin text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white/80 mb-2 text-left">
                Community
              </div>
              <div
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontWeight: 400,
                  fontStyle: "thin",
                  fontSize: "20px",
                  lineHeight: "150%",
                  letterSpacing: "-0.01em",
                  color: "#FFFFFF",
                  marginTop: "8px",
                  marginBottom: "0",
                  textAlign: "left",
                }}
              >
                Temukan dan bagikan workflow automation yang powerful.
              </div>
            </div>
            {/* Tengah: Garis Penghubung */}
            <div className="hidden md:flex items-center justify-center px-8">
              <div className="h-0.5 w-32 bg-white/40" />
            </div>
            {/* Kanan: Deskripsi */}
            <div className="hidden md:flex flex-1 min-w-0">
              <div
                className="font-sans font-normal text-lg text-white/80 text-left"
                style={{
                  fontFamily: "Albert Sans, Arial, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "28px", // sebelumnya 35px
                  lineHeight: "107%",
                  letterSpacing: "-0.01em",
                  color: "#FFFFFF",
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  textAlign: "left",
                }}
              >
                Bergabunglah dengan komunitas N8N Indonesia dan tingkatkan
                produktivitas Anda.
              </div>
            </div>
          </div>
        </div>
        {/* INSIGHT & BUTTONS */}
        <div className="w-full py-20 md:py-32 flex flex-col items-center">
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <div
              className="relative rounded-2xl border border-white/20 p-8 cursor-pointer overflow-hidden"
              style={{
                maxWidth: "840px",
                width: "100%",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Gradient overlay yang mengikuti cursor */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.4) 0%, rgba(168, 85, 247, 0.3) 30%, rgba(236, 72, 153, 0.2) 60%, transparent 100%)`,
                  opacity: isHovering ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out",
                }}
              />
              {/* Content */}
              <div className="relative z-10">
                <h2
                  style={{
                    fontFamily: "Albert Sans, Arial, sans-serif",
                    fontWeight: 250,
                    fontStyle: "thin",
                    fontSize: "48px",
                    lineHeight: "120%",
                    letterSpacing: "-0.02em",
                    color: "#FFFBFB",
                    textAlign: "left",
                    margin: 0,
                    marginBottom: "32px",
                  }}
                >
                  Dapatkan insight, workflow siap pakai, dan dukungan dari
                  komunitas yang aktif dan solutif. Workflow Hebat Dimulai dari
                  Sini.
                </h2>
                <div className="flex flex-row gap-4 md:gap-6">
                  <a
                    className="btn-jelajah flex items-center gap-3"
                    href="/workflows"
                  >
                    Jelajahi Workflow
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
                  <a
                    className="btn-creator flex items-center gap-3"
                    href="/directory"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
