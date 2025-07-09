"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar navigasi */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="text-center">
              <div className="flex flex-col gap-2">
                <Button
                  variant={
                    pathname.endsWith("/profile") ? "default" : "outline"
                  }
                  onClick={() => router.push("/dashboard-profile/profile")}
                  className="mb-2"
                >
                  Profil
                </Button>
                <Button
                  variant={
                    pathname.endsWith("/workflows") ? "default" : "outline"
                  }
                  onClick={() => router.push("/dashboard-profile/workflows")}
                >
                  Workflow Saya
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
        {/* Main content slot */}
        <div className="lg:col-span-3 space-y-8">{children}</div>
      </div>
    </div>
  );
}
