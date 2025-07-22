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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
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

  // Handle scroll untuk mengubah transparansi header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const shouldBeBlurred = scrollTop > 50 || scrollTop > 1000;
      setIsScrolled(shouldBeBlurred);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`${
        isScrolled ? "header-transparent" : "header-completely-transparent"
      } fixed top-0 left-0 right-0 z-40 transition-all duration-300`}
    >
      <div
        className={`${
          isScrolled
            ? "w-full px-4 sm:px-8 md:px-16 py-4"
            : "w-full px-4 sm:px-8 md:px-16 py-4 bg-transparent"
        } flex items-center justify-between`}
      >
        {/* Logo/Brand - Mobile */}
        <div className="md:hidden">
          <Link href="/" className="text-white font-bold text-xl">
            N8N
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex border-2 border-white/40 rounded-full px-2 py-1 gap-2 shadow-sm">
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

          {/* Avatar / Join Community */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 md:h-12 md:w-12 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage
                    src={profile?.profile_image || undefined}
                    alt={profile?.name || user.email}
                  />
                  <AvatarFallback
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      backgroundColor: "#374151",
                      color: "#F9FAFB",
                    }}
                  >
                    {getInitials(profile?.name || user.email)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-0 border border-white/10 shadow-2xl"
                style={{
                  background: "rgba(32, 26, 44, 0.4)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="flex flex-col items-center p-4 pb-3">
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage
                      src={profile?.profile_image || undefined}
                      alt={profile?.name || user.email}
                    />
                    <AvatarFallback
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        backgroundColor: "rgba(55, 65, 81, 0.6)",
                        color: "#F9FAFB",
                      }}
                    >
                      {getInitials(profile?.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-lg text-center w-full truncate text-white mb-1">
                    {profile?.name || user.email}
                  </div>
                  <div className="text-xs text-white/70 text-center w-full truncate">
                    {user.email}
                  </div>
                </div>
                <div className="border-t border-white/10 mx-3" />
                <div className="p-1">
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard-profile")}
                    className="text-white/90 hover:text-white hover:bg-white/5 focus:text-white focus:bg-white/5 rounded-lg mx-1 mb-1 px-3 py-2 transition-all duration-200 text-sm"
                  >
                    Dashboard Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-300 hover:text-red-200 hover:bg-red-500/10 focus:text-red-200 focus:bg-red-500/10 rounded-lg mx-1 px-3 py-2 transition-all duration-200 text-sm"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth"
              className="btn-login flex items-center gap-2 px-3 py-1.5 tablet:px-4 tablet:py-2 rounded-lg text-xs tablet:text-sm lg:text-base"
            >
              <span className="hidden sm:inline tablet:hidden lg:inline">
                Join Community
              </span>
              <span className="sm:hidden tablet:inline lg:hidden">Join</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 tablet:w-4 tablet:h-4 lg:w-5 lg:h-5"
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
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-900/95 to-blue-900/95 backdrop-blur-xl border-b border-white/10 max-h-screen overflow-y-auto">
            <div className="p-4 max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="text-white font-bold text-xl">
                  N8N Indonesia
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="space-y-2 mb-6">
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-base
                        ${
                          isActive
                            ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                            : "text-white hover:bg-white/10"
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="break-words overflow-hidden text-ellipsis">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile User Section */}
              {user && (
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage
                        src={profile?.profile_image || undefined}
                        alt={profile?.name || user.email}
                      />
                      <AvatarFallback
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          backgroundColor: "#374151",
                          color: "#F9FAFB",
                        }}
                      >
                        {getInitials(profile?.name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-sm break-words overflow-hidden text-ellipsis">
                        {profile?.name || user.email}
                      </div>
                      <div className="text-xs text-white/70 break-words overflow-hidden text-ellipsis">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push("/dashboard-profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-sm break-words"
                    >
                      Dashboard Profile
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-sm break-words"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
