"use client";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardFooter } from "@/components/dashboard-footer";

export default function DashboardProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
      {/* Header - Sticky */}
      <DashboardHeader />

      {/* Main Content - dengan padding yang responsif */}
      <main className="flex-1 px-2 sm:px-6 py-6 sm:py-12 pb-16 sm:pb-20 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full overflow-x-hidden">{children}</div>
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
