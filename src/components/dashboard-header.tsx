"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const navigation = [
    {
      label: "Dashboard Profile",
      href: "/dashboard-profile",
    },
    {
      label: "Workflow Saya",
      href: "/dashboard-profile/workflows",
    },
    {
      label: "Creator Saya",
      href: "/dashboard-profile/creator",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect ke halaman auth login setelah logout
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 px-2 sm:px-6 py-3 sm:py-4 shadow-sm w-full overflow-hidden">
      <div className="flex items-center justify-between w-full">
        {/* Logo dan Brand */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2 text-gray-900 hover:text-gray-700 transition-colors"
          >
            {/* N8N Logo - Node yang saling terhubung */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Node 1 - Left */}
                <circle
                  cx="2"
                  cy="12"
                  r="1.8"
                  fill="currentColor"
                  opacity="1"
                />
                {/* Node 2 - Left Center */}
                <circle
                  cx="7"
                  cy="12"
                  r="1.8"
                  fill="currentColor"
                  opacity="1"
                />
                {/* Node 3 - Center */}
                <circle
                  cx="12"
                  cy="12"
                  r="1.8"
                  fill="currentColor"
                  opacity="1"
                />
                {/* Node 4 - Right Top */}
                <circle
                  cx="17"
                  cy="6"
                  r="1.8"
                  fill="currentColor"
                  opacity="1"
                />
                {/* Node 5 - Right Bottom */}
                <circle
                  cx="17"
                  cy="18"
                  r="1.8"
                  fill="currentColor"
                  opacity="1"
                />

                {/* Koneksi antar node */}
                <path
                  d="M3.8 12L5.2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="1"
                  strokeLinecap="round"
                />
                <path
                  d="M8.8 12L10.2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="1"
                  strokeLinecap="round"
                />
                <path
                  d="M13.8 12L15.2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="1"
                  strokeLinecap="round"
                />
                <path
                  d="M15.2 12L17 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="1"
                  strokeLinecap="round"
                />
                <path
                  d="M15.2 12L17 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">n8n ID</span>
          </Link>

          {/* Navigation Menu - Compact for mobile */}
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`text-xs sm:text-sm font-medium transition-colors pb-1 sm:pb-2 whitespace-nowrap ${
                      isActive
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <div
                      className="absolute -bottom-3 sm:-bottom-4 left-0 right-0 h-0.5 bg-purple-600 z-10"
                    ></div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-900 h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </Button>

          {/* User Profile Dropdown - Hanya Icon */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0 hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={profile?.profile_image || undefined}
                    alt={profile?.name || user?.email || "User"}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium">
                    {profile?.name?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-black hover:text-black"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
