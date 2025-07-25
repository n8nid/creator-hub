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
      className="sticky top-0 transition-all duration-300 ease-in-out"
      style={{
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "none",
        isolation: "isolate",
      }}
    >
      <div
        className={`${"w-full container-box"} flex items-center justify-between pt-[4rem] md:pt-[4rem] sm:pt-[2rem] xs:pt-[1rem]`}
      >
        {/* Logo/Brand - Mobile */}
        <div className="md:hidden flex items-center gap-2">
          {/* N8N Logo - Node yang saling terhubung */}
          <div className="w-8 h-8 flex items-center justify-center text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Node 1 - Left */}
              <circle cx="2" cy="12" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 2 - Left Center */}
              <circle cx="7" cy="12" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 3 - Center */}
              <circle cx="12" cy="12" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 4 - Right Top */}
              <circle cx="17" cy="6" r="1.8" fill="currentColor" opacity="1" />
              {/* Node 5 - Right Bottom */}
              <circle cx="17" cy="18" r="1.8" fill="currentColor" opacity="1" />
              {/* Connection Lines - Improved connections */}
              <path
                d="M3.8 12H6.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8.8 12H11.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M13.8 12H15.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15.2 12L17 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15.2 12L17 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">n8n ID</span>
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
          {/* Mobile - Join Community Button */}
          {!user && (
            <div className="md:hidden">
              <Link
                href="/auth"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Join Community
              </Link>
            </div>
          )}

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
                  className="w-72 bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md border border-purple-500/30 shadow-2xl shadow-purple-500/20 rounded-xl overflow-hidden"
                >
                  {/* User Info Section */}
                  <div className="p-4 border-b border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 ring-2 ring-purple-500/50">
                        <AvatarImage
                          src={profile?.profile_image || ""}
                          alt={profile?.name || user.email}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold">
                          {getInitials(profile?.name || user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">
                          {profile?.name || user.email}
                        </div>
                        <div className="text-purple-200 text-xs truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link href="/dashboard-profile" passHref legacyBehavior>
                      <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 group">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Dashboard Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all duration-200 group"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </div>
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
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu */}
          <div className="md:hidden absolute top-full left-0 right-0 bg-[rgba(32,26,44,0.98)] border-t border-white/20 z-50 shadow-lg">
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
                          ? "bg-[rgba(147,51,234,0.2)] text-white"
                          : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Mobile - User Avatar or Join Community */}
                <div className="border-t border-white/20 pt-4 mt-2">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      {/* User Info */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Avatar className="w-10 h-10 ring-2 ring-purple-500/50">
                          <AvatarImage
                            src={profile?.profile_image || ""}
                            alt={profile?.name || user.email}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
                            {getInitials(profile?.name || user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white">
                            {profile?.name || user.email}
                          </div>
                          <div className="text-xs text-purple-200">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 px-4">
                        <Link href="/dashboard-profile" passHref legacyBehavior>
                          <button
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-white hover:bg-white/10 rounded-lg font-medium transition-all duration-200 group"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <span>Dashboard Profile</span>
                          </button>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg font-medium transition-all duration-200 group"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      className="flex items-center gap-3 px-4 py-3 text-purple-300 hover:bg-white/10 rounded-lg font-medium"
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
        </>
      )}
    </header>
  );
}
