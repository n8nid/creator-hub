"use client";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function DashboardProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
