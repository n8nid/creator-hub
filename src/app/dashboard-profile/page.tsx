"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Globe,
  Linkedin,
  Github,
  Instagram,
  MapPin,
  Workflow,
  Star,
  User,
  TrendingUp,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Download,
  Twitter,
  Youtube,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FaDiscord } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string>("");
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    publishedWorkflows: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
  });
  const [recentActivities, setRecentActivities] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      icon: any;
      color: string;
    }>
  >([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setProfile(data);
        if (data) {
          setProfileImage(data.profile_image || "");
        }

        // Fetch stats
        if (data) {
          const { count: totalWorkflows } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", data.id);

          const { count: publishedWorkflows } = await supabase
            .from("workflows")
            .select("*", { count: "exact", head: true })
            .eq("profile_id", data.id)
            .eq("status", "approved");

          const { data: workflows } = await supabase
            .from("workflows")
            .select("id")
            .eq("profile_id", data.id);

          let totalLikes = 0;
          if (workflows && workflows.length > 0) {
            const workflowIds = workflows.map((w) => w.id);
            const { count: likesCount } = await supabase
              .from("workflow_interactions")
              .select("*", { count: "exact", head: true })
              .in("workflow_id", workflowIds)
              .eq("type", "star");
            totalLikes = likesCount || 0;
          }

          // Get followers count (placeholder for future implementation)
          const { count: followersCount } = await supabase
            .from("creator_followers")
            .select("*", { count: "exact", head: true })
            .eq("creator_id", data.id);

          // Get following count (placeholder for future implementation)
          const { count: followingCount } = await supabase
            .from("creator_followers")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", data.id);

          setStats({
            totalWorkflows: totalWorkflows || 0,
            publishedWorkflows: publishedWorkflows || 0,
            totalLikes,
            followers: followersCount || 0,
            following: followingCount || 0,
          });

          // Fetch recent activities
          const activities: Array<{
            id: string;
            type: string;
            title: string;
            description: string;
            timestamp: string;
            icon: any;
            color: string;
          }> = [];

          // Get recent workflows
          const { data: recentWorkflows } = await supabase
            .from("workflows")
            .select("id, title, created_at, status")
            .eq("profile_id", data.id)
            .order("created_at", { ascending: false })
            .limit(3);

          if (recentWorkflows) {
            recentWorkflows.forEach((workflow) => {
              activities.push({
                id: workflow.id,
                type: "workflow_created",
                title: `Membuat workflow "${workflow.title}"`,
                description:
                  workflow.status === "approved"
                    ? "Workflow dipublikasikan"
                    : "Workflow dalam review",
                timestamp: workflow.created_at,
                icon: Workflow,
                color:
                  workflow.status === "approved"
                    ? "text-green-600"
                    : "text-yellow-600",
              });
            });
          }

          // Get recent likes/stars
          if (workflows && workflows.length > 0) {
            const workflowIds = workflows.map((w) => w.id);
            const { data: recentLikes } = await supabase
              .from("workflow_interactions")
              .select("id, workflow_id, created_at")
              .in("workflow_id", workflowIds)
              .eq("type", "star")
              .order("created_at", { ascending: false })
              .limit(2);

            if (recentLikes) {
              // Get workflow titles for likes
              const likeWorkflowIds = recentLikes.map(
                (like) => like.workflow_id
              );
              const { data: likeWorkflows } = await supabase
                .from("workflows")
                .select("id, title")
                .in("id", likeWorkflowIds);

              recentLikes.forEach((like) => {
                const workflow = likeWorkflows?.find(
                  (w) => w.id === like.workflow_id
                );
                activities.push({
                  id: like.id,
                  type: "workflow_liked",
                  title: `Workflow "${
                    workflow?.title || "Unknown"
                  }" mendapat like`,
                  description: "Seseorang menyukai workflow Anda",
                  timestamp: like.created_at,
                  icon: Heart,
                  color: "text-red-600",
                });
              });
            }
          }

          // Sort activities by timestamp
          activities.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setRecentActivities(activities.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</p>
        <p className="text-gray-600 mb-6">
          Silakan login untuk melihat dashboard Anda.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 mt-4 w-full max-w-full overflow-hidden px-2 sm:px-0">
      {/* Main Content Grid - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 w-full max-w-full">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 w-full">
          <Card className="p-3 sm:p-4 lg:p-6 w-full max-w-xs lg:max-w-sm mx-auto">
            <div className="text-center mb-4 sm:mb-5 lg:mb-6">
              <div className="lg:flex lg:justify-center">
                <Avatar className="h-24 w-24 sm:h-32 lg:h-40 sm:w-32 lg:w-40 mx-auto mb-3 sm:mb-4">
                  <AvatarImage
                    src={
                      profileImage
                        ? `${profileImage}?t=${Date.now()}`
                        : undefined
                    }
                  />
                  <AvatarFallback className="text-xl sm:text-2xl lg:text-3xl">
                    {profile?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-words text-center">
                {profile?.name}
              </h2>

              {/* Experience Level */}
              {profile?.experience_level && (
                <div className="mb-2 sm:mb-3">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {profile.experience_level}
                  </Badge>
                </div>
              )}

              <p className="text-gray-600 mb-3 sm:mb-4 text-sm lg:text-base break-words">
                {profile?.bio || "Belum ada bio yang ditambahkan"}
              </p>

              {/* Edit Profile Button */}
              <div className="lg:flex lg:justify-center">
                <Button
                  asChild
                  className="bg-purple-900 hover:bg-purple-800 text-white mb-4 sm:mb-6 w-full sm:w-auto text-sm lg:text-base px-4 py-2 lg:px-6 lg:py-3"
                >
                  <Link href="/dashboard-profile/profile/edit">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </div>

            {/* Profile Info - Left Aligned */}
            <div className="text-left space-y-3 sm:space-y-3 lg:space-y-4">
              {/* Follower/Following Stats */}
              <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm lg:text-base">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 sm:h-4 lg:h-4 sm:w-4 lg:w-4 text-gray-600" />
                  <span className="font-semibold">{stats.followers}</span>
                  <span className="text-gray-600">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{stats.following}</span>
                  <span className="text-gray-600">following</span>
                </div>
              </div>

              {/* Location */}
              {profile?.location && (
                <div className="flex items-center text-gray-600 text-xs sm:text-sm lg:text-base">
                  <MapPin className="h-3 w-3 sm:h-4 lg:h-4 sm:w-4 lg:w-4 mr-1" />
                  {profile.location}
                </div>
              )}

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Website"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Twitter"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Github className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.threads && (
                  <a
                    href={profile.threads}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Threads"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18.5A8.5 8.5 0 1 1 12 3.5a8.5 8.5 0 0 1 0 17Zm.25-13.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Zm-2.5 2.5a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm5 0a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm-2.5 8.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </a>
                )}
                {profile?.discord && (
                  <a
                    href={profile.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Discord"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaDiscord className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.Whatsapp && (
                  <a
                    href={`https://wa.me/${profile.Whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
                {profile?.youtube && (
                  <a
                    href={profile.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="YouTube"
                    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 w-full">
          {/* About Section */}
          <Card className="w-full">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Tentang Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {profile?.about_markdown ? (
                <div className="prose prose-sm max-w-none w-full">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {profile.about_markdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p>Belum ada deskripsi yang ditambahkan</p>
                  <p className="text-sm">
                    Edit profil untuk menambahkan deskripsi tentang diri Anda
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card className="w-full">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Statistik Kontribusi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Workflow className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 mr-2" />
                    <span className="text-xl sm:text-2xl font-bold">
                      {stats.totalWorkflows}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Workflows
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 mr-2" />
                    <span className="text-xl sm:text-2xl font-bold">
                      {stats.publishedWorkflows}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Published</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 mr-2" />
                    <span className="text-xl sm:text-2xl font-bold">
                      {stats.totalLikes}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Likes
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 mr-2" />
                    <span className="text-xl sm:text-2xl font-bold">
                      {profile?.created_at
                        ? new Date(profile.created_at).getFullYear()
                        : "-"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Member Since
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="w-full">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 w-full">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors w-full"
                      >
                        <div
                          className={`p-2 rounded-full bg-gray-100 ${activity.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Clock className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada aktivitas terbaru</p>
                  <p className="text-sm">Aktivitas Anda akan muncul di sini</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
