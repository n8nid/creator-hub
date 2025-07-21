"use client";
import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardFooter } from "./dashboard-footer";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
      {/* Header - Sticky */}
      <DashboardHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile, collapsible on tablet */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-56 bg-white border-r transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          tablet:relative tablet:translate-x-0 tablet:z-auto
          ${sidebarOpen ? 'tablet:w-56' : 'tablet:w-16'}
        `}>
          <div className="flex items-center justify-between p-4 border-b tablet:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DashboardSidebar isCollapsed={!sidebarOpen} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 tablet:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 px-2 sm:px-6 py-6 sm:py-12 tablet:py-6 pb-16 sm:pb-20 w-full overflow-x-hidden ${!sidebarOpen ? 'tablet:ml-16' : 'tablet:ml-56'}`}>
          {/* Mobile Menu Button */}
          <div className="sm:hidden mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              Menu
            </Button>
          </div>

          <div className="max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
} 