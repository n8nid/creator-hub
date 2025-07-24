"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-300 px-2 sm:px-4 tablet:px-6 py-3 sm:py-4 shadow-sm w-full overflow-hidden">
        <div className="flex items-center w-full">
          {/* Left Side - Logo, Brand, and Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-1">
            {/* Logo dan Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-gray-900 hover:text-gray-700 transition-colors"
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
              <span className="text-lg sm:text-xl font-bold">n8n ID</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile, positioned next to logo */}
            <nav className="hidden sm:flex items-center gap-4 sm:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side - User Menu & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100"
                >
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage
                      src={profile?.profile_image || undefined}
                      alt={profile?.name || "User"}
                    />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {profile?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {profile?.name || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button - Only visible on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            onClick={toggleMobileMenu}
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 w-64 h-full bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out sm:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMobileMenu}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Sign Out */}
              <button
                onClick={() => {
                  handleSignOut();
                  toggleMobileMenu();
                }}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
