"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Bell, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navigation = [
    {
      label: "Dashboard",
      href: "/dashboard-profile",
    },
    {
      label: "Profil Saya",
      href: "/dashboard-profile/profile",
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
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo dan Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard-profile"
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
          >
            {/* N8N Logo - Node yang saling terhubung */}
            <div className="w-8 h-8 flex items-center justify-center">
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
            <span className="text-lg font-semibold tracking-wide">n8n ID</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-600 hover:text-gray-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard-profile/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
