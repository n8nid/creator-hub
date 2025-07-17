"use client";

import { usePathname } from "next/navigation";
import { HeaderNav } from "@/components/header-nav";
import MainFooter from "@/components/main-footer";
import { DebugAuth } from "@/components/auth/debug-auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth" || pathname === "/auth/reset-password";

  // Halaman yang menggunakan layout sendiri (tidak perlu header/footer lama)
  const isDashboardPage = pathname.startsWith("/dashboard-profile");
  const isAdminPage = pathname.startsWith("/admin");

  if (isAuthPage) {
    return (
      <>
        {children}
        <DebugAuth />
      </>
    );
  }

  // Untuk halaman dashboard dan admin, tidak tampilkan header/footer lama
  if (isDashboardPage || isAdminPage) {
    return (
      <>
        {children}
        <DebugAuth />
      </>
    );
  }

  return (
    <>
      <HeaderNav />
      {children}
      <MainFooter />
      <DebugAuth />
    </>
  );
}
