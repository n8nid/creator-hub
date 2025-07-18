"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignUpForm } from "@/components/auth/signup-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { useAuth } from "@/lib/auth-context";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthToaster } from "@/components/auth/auth-toaster";

export default function AuthPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [forceShow, setForceShow] = useState(false);

  const handleRedirect = useCallback(async () => {
    if (!loading && user) {
      setIsRedirecting(true);
      const admin = await isAdmin(user.id);
      if (admin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Fallback to show the page after 2 seconds if still loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setForceShow(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  // Show loading state only briefly while checking authentication
  if (loading && !forceShow) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(circle at center, #2D1B69 0%, #1A1A2E 50%, #0F0F23 100%)",
        }}
      >
        <AuthHeader />
        <AuthToaster />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting state briefly for logged in users
  if (user && isRedirecting) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(circle at center, #2D1B69 0%, #1A1A2E 50%, #0F0F23 100%)",
        }}
      >
        <AuthHeader />
        <AuthToaster />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-300">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #2D1B69 0%, #1A1A2E 50%, #0F0F23 100%)",
      }}
    >
      <AuthHeader />
      <AuthToaster />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] -mt-8">
        <div className="w-full max-w-md space-y-6 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-300">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-lg p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/20">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-gray-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-gray-300"
                >
                  Sign Up
                </TabsTrigger>
                <TabsTrigger
                  value="reset"
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-white text-gray-300"
                >
                  Reset Password
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup" className="mt-0">
                <SignUpForm />
              </TabsContent>
              <TabsContent value="reset" className="mt-0">
                <ResetPasswordForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
