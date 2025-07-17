"use client";

import { Button } from "@/components/ui/button";
import { Home, Workflow, User, Link as LinkIcon } from "lucide-react";
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

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Workflow",
    href: "/workflows",
    icon: Workflow,
  },
  {
    label: "Creator",
    href: "/creators",
    icon: User,
  },
  {
    label: "Connect With Us",
    href: "/connect",
    icon: LinkIcon,
  },
];

export function HeaderNav() {
  const { user, isAdmin, signOut } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchRoleAndProfile = async () => {
      if (user) {
        setIsUserAdmin(await isAdmin(user.id));
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

  // Handle scroll untuk mengubah transparansi header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Header akan blur ketika scroll lebih dari 50px
      // Atau ketika mencapai section Key Benefits (sekitar 1000px)
      const shouldBeBlurred = scrollTop > 50 || scrollTop > 1000;
      setIsScrolled(shouldBeBlurred);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header
      className={`${
        isScrolled ? "header-transparent" : "header-completely-transparent"
      } sticky top-0 z-50 transition-all duration-300`}
      style={{
        background: isScrolled ? "rgba(32, 26, 44, 0.98)" : "transparent",
        backdropFilter: isScrolled ? "blur(40px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(40px)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255, 255, 255, 0.15)"
          : "none",
        boxShadow: isScrolled ? "0 10px 40px rgba(0, 0, 0, 0.4)" : "none",
        isolation: "isolate",
        transform: "translateZ(0)",
      }}
    >
      <div
        className={`${
          isScrolled ? "w-full px-4 py-4" : "w-full px-4 py-4 bg-transparent"
        } flex items-center justify-between`}
      >
        {/* NAVBAR MENU */}
        <div
          className={`${
            isScrolled ? "navbar-container-scrolled" : "navbar-container-top"
          } flex border-2 border-white/40 rounded-full px-2 py-1 gap-2 ${
            isScrolled ? "shadow-lg" : "shadow-sm"
          }`}
        >
          {navItems.map((item) => {
            // Logika untuk menentukan apakah menu aktif
            let isActive = false;
            if (item.href === "/") {
              // Home aktif hanya jika di halaman utama
              isActive = pathname === "/";
            } else if (item.href === "/workflows") {
              // Workflow aktif jika di /workflows atau /workflows/[id]
              isActive =
                pathname === "/workflows" || pathname.startsWith("/workflows/");
            } else if (item.href === "/creators") {
              // Creator aktif jika di /creators atau /talent/[id]
              isActive =
                pathname === "/creators" ||
                pathname.startsWith("/talent/") ||
                pathname.startsWith("/creators/");
            } else {
              // Untuk menu lain, gunakan exact match
              isActive = pathname === item.href;
            }

            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-200 text-base select-none
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                      : "bg-transparent text-white hover:bg-white/10"
                  }
                `}
                style={{ minWidth: 0 }}
              >
                <span className="truncate">{item.label}</span>
                {isActive && <Icon className="w-5 h-5 text-purple-700" />}
              </Link>
            );
          })}
        </div>
        {/* AVATAR / JOIN COMMUNITY */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={profile?.profile_image || undefined}
                  alt={profile?.name || user.email}
                />
                <AvatarFallback style={{ fontSize: 24, fontWeight: "bold" }}>
                  {getInitials(profile?.name || user.email)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0">
              <div className="flex flex-col items-center p-4 pb-2">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage
                    src={profile?.profile_image || undefined}
                    alt={profile?.name || user.email}
                  />
                  <AvatarFallback style={{ fontSize: 32, fontWeight: "bold" }}>
                    {getInitials(profile?.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="font-semibold text-lg text-center w-full truncate">
                  {profile?.name || user.email}
                </div>
                <div className="text-xs text-gray-500 text-center w-full truncate">
                  {user.email}
                </div>
              </div>
              <div className="border-t my-2" />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard-profile/profile")}
              >
                Dashboard Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth" className="btn-login flex items-center gap-2 ml-4">
            Join Community
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
                d="M16.5 3.75h2.25A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H16.5m-6-4.5 3-3m0 0-3-3m3 3H3"
              />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}
