"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  FileText,
  Bell,
  BarChart3,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Bypass authentication untuk testing (development only)
  const isDevelopment = process.env.NODE_ENV === "development";
  const bypassAuth =
    isDevelopment && process.env.NEXT_PUBLIC_BYPASS_ADMIN === "true";

  // Redirect to auth if not logged in (client-side guard as backup)
  useEffect(() => {
    if (!loading && !user && !bypassAuth) {
      router.push("/auth");
    }
  }, [user, loading, router, bypassAuth]);

  // Show loading state while checking authentication
  if (loading && !bypassAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (unless bypass)
  if (!user && !bypassAuth) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Moderasi Creator", href: "/admin/creators", icon: UserCheck },
    { name: "Moderasi Workflow", href: "/admin/workflows", icon: FileText },
    { name: "Manajemen User", href: "/admin/users", icon: Users },
    { name: "Notifikasi", href: "/admin/notifications", icon: Bell },
    { name: "Statistik", href: "/admin/statistics", icon: BarChart3 },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentPage = navigation.find((item) => item.href === pathname);
    return currentPage ? currentPage.name : "Dashboard";
  };

  // Mock user untuk testing
  const mockUser = bypassAuth
    ? {
        email: "admin@test.com",
        id: "test-admin-id",
      }
    : user;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Development Notice */}
      {bypassAuth && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-center text-yellow-800 text-sm">
            <Shield className="h-4 w-4 mr-2" />
            <span>Development Mode: Admin Panel Bypass Active</span>
          </div>
        </div>
      )}

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="admin-panel-title">Admin Panel</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isActive ? "admin-nav-item-active" : "admin-nav-item"
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {mockUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="admin-user-info truncate">{mockUser?.email}</p>
                <p className="admin-user-role">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="h-16 flex items-center justify-between px-4">
            <h2 className="admin-page-title">{getCurrentPageTitle()}</h2>
            <div className="flex items-center space-x-2">
              <span className="admin-user-role">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
