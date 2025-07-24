"use client";
import { DashboardHeader } from "./dashboard-header";
import { DashboardFooter } from "./dashboard-footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
      {/* Header - Sticky */}
      <DashboardHeader />

      {/* Main Content Area - Full Width */}
      <main className="flex-1 px-2 sm:px-6 py-6 sm:py-12 pb-16 sm:pb-20 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
