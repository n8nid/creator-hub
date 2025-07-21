"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DebugAuth() {
  const { user, session, loading } = useAuth();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Card className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 w-72 sm:w-80 max-w-[calc(100vw-1rem)] z-50 bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-yellow-800 break-words">
          Auth Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-xs">
        <div className="space-y-1 text-yellow-700">
          <div className="break-words">
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </div>
          <div className="break-words">
            <strong>User:</strong> {user ? user.email : "None"}
          </div>
          <div className="break-words">
            <strong>Session:</strong> {session ? "Active" : "None"}
          </div>
          <div className="break-words">
            <strong>User ID:</strong> {user?.id || "N/A"}
          </div>
          <div className="break-words">
            <strong>Session ID:</strong>{" "}
            {session?.access_token
              ? session.access_token.substring(0, 15) + "..."
              : "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
