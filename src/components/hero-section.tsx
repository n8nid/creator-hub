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
      <div className="w-full container-box relative z-10 mt-40 2xl:mt-mt-custom-14">
        {/* HERO HEADING & SUBHEADING */}
        <div className="w-full pt-0 2xl:pt-20 flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col lg:flex-row lg:items-center w-full">
            {/* Kiri: Heading, Community, dan Deskripsi */}
            <div className="flex flex-col md:items-start items-center flex-1">
              <h1>
                N8N Indonesia
              </h1>
              <div className="h1-large">
                Community
              </div>
              <p className="paragraph-17-reguler">
                Temukan dan bagikan workflow automation yang powerful.
              </p>
            </div>
            {/* Tengah: Garis Penghubung */}
            <div className="hidden lg:flex items-center justify-center px-8">
              <div className="h-0.5 w-[10rem] 2xl:w-52 bg-white/40" />
            </div>
            {/* Kanan: Deskripsi */}
            <div className="hidden md:flex flex-1 min-w-0">
              <p className="desc-hero-screen lg:mt-0 mt-[5rem]">
                Bergabunglah dengan komunitas N8N Indonesia dan tingkatkan
                produktivitas Anda.
              </p>
            </div>
          </div>
        </div>
        {/* INSIGHT & BUTTONS */}
        <div className="w-full pt-[10rem] 2xl:pt-[15.625rem] flex flex-col items-center">
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <div
              className="2xl:px-[20rem]"
            >
              {/* Gradient overlay yang mengikuti cursor */}
              <div />
              {/* Content */}
              <div className="relative z-10">
                <h2 className="lg:text-start text-center">
                  <span
                    className="lg:text-[5rem] text-[3rem]"
                    style={{
                      fontFamily: "Albert Sans",
                      fontWeight: 250,
                      fontStyle: "thin",
                      lineHeight: "5.875rem",
                      letterSpacing: "-5%",
                    }}
                  >
                    Dapatkan insight, workflow siap pakai, dan dukungan dari komunitas yang aktif dan solutif. Workflow Hebat Dimulai dari Sini.
                  </span>
                </h2>
                <div className="mt-[2.5rem] flex flex-col sm:flex-row md:justify-start justify-center gap-3 md:gap-6">
                  <a
                    className="btn-jelajah flex items-center justify-center gap-3 w-full sm:w-auto"
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
                    className="btn-creator flex items-center justify-center gap-3 w-full sm:w-auto"
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
