"use client";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardFooter } from "@/components/dashboard-footer";

export default function DashboardProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Sticky */}
      <DashboardHeader />

      {/* Main Content - dengan padding yang lebih besar */}
      <main className="flex-1 px-6 py-12 pb-20">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
