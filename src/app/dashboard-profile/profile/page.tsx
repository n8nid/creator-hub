"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Youtube,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

export default function ProfileSubPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
      if (data) {
        setProfileImage(data.profile_image || "");
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
        <p className="text-gray-600 mb-6">
          Silakan login untuk melihat profil Anda.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <Button asChild>
          <Link href="/dashboard-profile/profile/edit">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 flex justify-center">
          <Card className="sticky top-8 w-full max-w-xs md:max-w-sm mx-auto">
            <CardHeader className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.name}
              </h1>
              {profile?.location && (
                <div className="flex items-center justify-center text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {profile?.experience_level && (
                  <Badge variant="secondary">{profile.experience_level}</Badge>
                )}
                {profile?.availability && (
                  <Badge
                    variant={
                      profile.availability === "available"
                        ? "default"
                        : "outline"
                    }
                  >
                    {profile.availability}
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links - Horizontal, rapi, besar, dan center */}
              <div className="flex justify-center mt-8 mb-2">
                <div className="flex gap-6 flex-wrap justify-center">
                  {profile?.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Website"
                    >
                      <Globe className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                  {profile?.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Twitter"
                    >
                      <Twitter className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                    >
                      <Github className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                  {profile?.instagram && (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram"
                    >
                      <Instagram className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                  {profile?.threads && (
                    <a
                      href={profile.threads}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Threads"
                    >
                      <svg
                        className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors"
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
                    >
                      <FaDiscord className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                  {profile?.youtube && (
                    <a
                      href={profile.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="YouTube"
                    >
                      <Youtube className="h-6 w-6 text-blue-500 hover:text-blue-700 transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">About</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile?.bio || "No bio available."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
