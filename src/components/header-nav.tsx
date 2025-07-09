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
import { useRouter } from "next/navigation";

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
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Workflow className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AutoTalent</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {/* Menu utama */}
          <Link
            href="/creators"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Creator
          </Link>
          <Link
            href="/directory"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Talent
          </Link>
          <Link
            href="/workflows"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Workflow
          </Link>
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
                    <AvatarFallback
                      style={{ fontSize: 32, fontWeight: "bold" }}
                    >
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
            <Link
              href="/auth"
              className="ml-4 px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-gray-900 transition-all"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
