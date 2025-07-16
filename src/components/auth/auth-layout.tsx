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

  if (isAuthPage) {
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
