"use client";

import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
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

export function HeaderNav() {
  const { user, isAdmin, signOut } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
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

  return (
    <header className="header-gradient sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="header-nav-group ml-0">
          <Link
            href="/"
            className={`header-btn header-btn-home${
              pathname === "/" ? " header-btn-active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/workflows"
            className={`header-btn header-btn-workflow${
              pathname === "/workflows" ? " header-btn-active" : ""
            }`}
          >
            Workflow
          </Link>
          <Link
            href="/directory"
            className={`header-btn header-btn-creator${
              pathname === "/directory" ? " header-btn-active" : ""
            }`}
          >
            Creator
          </Link>
          <Link
            href="/connect"
            className={`header-btn header-btn-connect${
              pathname === "/connect" ? " header-btn-active" : ""
            }`}
          >
            Connect With Us
          </Link>
        </div>
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
          <Link href="/auth" className="btn-login flex items-center gap-2">
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
