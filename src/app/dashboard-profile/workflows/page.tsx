"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Workflow } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function WorkflowsSubPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [myWorkflows, setMyWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!profile?.id) return;
    const fetchMyWorkflows = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("workflows")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });
      setMyWorkflows(data || []);
      setLoading(false);
    };
    fetchMyWorkflows();
  }, [profile]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk mengelola workflow Anda.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Workflow Saya</h2>
        <Button
          asChild
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white"
        >
          <Link href="/dashboard-profile/workflows/add">
            <Plus className="w-4 h-4" /> Tambah Workflow
          </Link>
        </Button>
      </div>

      {/* List workflow user */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-1 mt-4">
                  <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-24 mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myWorkflows.map((w) => (
            <Card key={w.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {w.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full">
                        {w.complexity || "-"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                          w.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : w.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : w.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {w.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(w.tags || []).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  Created: {w.created_at?.slice(0, 10)}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/dashboard-profile/workflows/${w.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {myWorkflows.length === 0 && (
            <div className="text-gray-500 text-center col-span-full py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada workflow
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai dengan menambahkan workflow pertama Anda
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              >
                <Link href="/dashboard-profile/workflows/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Workflow Pertama
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
