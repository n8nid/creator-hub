"use client";

import { Button } from "@/components/ui/button";
import { Home, Workflow, User, Link as LinkIcon, Menu, X } from "lucide-react";
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
    href: "/connect-with-us",
    icon: LinkIcon,
  },
];

export function HeaderNav() {
  const { user, isAdmin, signOut } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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

  // Tutup mobile menu ketika route berubah
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300 ease-in-out"
      style={{
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "none",
        isolation: "isolate",
      }}
    >
      <div
        className={`${"w-full container-box"} flex items-center justify-between pt-[4rem]`}
      >
        {/* Logo/Brand - Mobile */}
        <div className="md:hidden">
          <Link href="/" className="text-white font-bold text-xl">
            N8N
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex border-2 border-white/40 rounded-full px-2 py-1 gap-2">
          {navItems.map((item) => {
            let isActive = false;
            if (item.href === "/") {
              isActive = pathname === "/";
            } else if (item.href === "/workflows") {
              isActive =
                pathname === "/workflows" || pathname.startsWith("/workflows/");
            } else if (item.href === "/creators") {
              isActive =
                pathname === "/creators" ||
                pathname.startsWith("/talent/") ||
                pathname.startsWith("/creators/");
            } else if (item.href === "/connect-with-us") {
              isActive = pathname === "/connect-with-us";
            } else {
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

        {/* Right side - Avatar/Join Community + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop - User Avatar or Join Community */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={profile?.profile_image || ""}
                        alt={profile?.name || user.email}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
                        {getInitials(profile?.name || user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm font-medium">
                      {profile?.name || user.email}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 backdrop-blur-sm border border-white/20"
                >
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="btn-login">
                Join Community
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-white/20">
          <div className="container-box py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                let isActive = false;
                if (item.href === "/") {
                  isActive = pathname === "/";
                } else if (item.href === "/workflows") {
                  isActive =
                    pathname === "/workflows" ||
                    pathname.startsWith("/workflows/");
                } else if (item.href === "/creators") {
                  isActive =
                    pathname === "/creators" ||
                    pathname.startsWith("/talent/") ||
                    pathname.startsWith("/creators/");
                } else if (item.href === "/connect-with-us") {
                  isActive = pathname === "/connect-with-us";
                } else {
                  isActive = pathname === item.href;
                }

                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile - User Avatar or Join Community */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                {user ? (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={profile?.profile_image || ""}
                        alt={profile?.name || user.email}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
                        {getInitials(profile?.name || user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {profile?.name || user.email}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center gap-3 px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Join Community</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
