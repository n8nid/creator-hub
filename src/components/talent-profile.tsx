"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  DollarSign,
  Globe,
  Linkedin,
  Twitter,
  Github,
  ArrowLeft,
  Play,
  ImageIcon,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";
import { FaDiscord, FaWhatsapp } from "react-icons/fa";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Workflow = Database["public"]["Tables"]["workflows"]["Row"];

interface TalentProfileProps {
  profileId: string;
}

export function TalentProfile({ profileId }: TalentProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [profileId]);

  const fetchProfileData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .eq("status", "approved")
        .single();

      if (profileError) throw profileError;

      // Fetch workflows
      const { data: workflowsData, error: workflowsError } = await supabase
        .from("workflows")
        .select("*")
        .eq("profile_id", profileId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (workflowsError) throw workflowsError;

      setProfile(profileData);
      setWorkflows(workflowsData || []);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Profile Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The profile you're looking for doesn't exist or hasn't been approved
          yet.
        </p>
        <Button asChild>
          <Link href="/directory">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/directory">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={profile.profile_image || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              {profile.location && (
                <div className="flex items-center justify-center text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.experience_level && (
                  <Badge variant="secondary">{profile.experience_level}</Badge>
                )}
                {profile.availability && (
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

              {/* Rate */}
              {profile.hourly_rate && (
                <div className="text-center">
                  <div className="flex items-center justify-center text-lg font-semibold text-gray-900">
                    <DollarSign className="h-5 w-5 mr-1" />$
                    {profile.hourly_rate}/hour
                  </div>
                </div>
              )}

              <Separator />

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-4 justify-center mt-4">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Website"
                  >
                    <Globe className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                  >
                    <Github className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.threads && (
                  <a
                    href={profile.threads}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Threads"
                  >
                    <svg
                      className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 18.5A8.5 8.5 0 1 1 12 3.5a8.5 8.5 0 0 1 0 17Zm.25-13.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Zm-2.5 2.5a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm5 0a.75.75 0 0 1 1.5 0v6.5a.75.75 0 0 1-1.5 0v-6.5Zm-2.5 8.25a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" />
                    </svg>
                  </a>
                )}
                {profile.discord && (
                  <a
                    href={profile.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Discord"
                  >
                    <FaDiscord className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.Whatsapp && (
                  <a
                    href={`https://wa.me/${profile.Whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp"
                  >
                    <FaWhatsapp className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
                {profile.youtube && (
                  <a
                    href={profile.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="YouTube"
                  >
                    <Youtube className="h-5 w-5 text-blue-600 hover:text-blue-800 transition-colors" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "No bio available."}
              </p>
            </CardContent>
          </Card>

          {/* Workflows Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Workflow Portfolio
                <Badge variant="secondary" className="ml-2">
                  {workflows.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workflows.length > 0 ? (
                <div className="grid gap-6">
                  {workflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {workflow.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {workflow.description}
                          </p>
                        </div>
                        {workflow.complexity && (
                          <Badge
                            variant={
                              workflow.complexity === "complex"
                                ? "destructive"
                                : workflow.complexity === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {workflow.complexity}
                          </Badge>
                        )}
                      </div>

                      {/* Workflow Tags */}
                      {workflow.tags && workflow.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {workflow.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Media */}
                      <div className="flex items-center space-x-4">
                        {workflow.screenshot_url && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Screenshot Available
                          </div>
                        )}
                        {workflow.video_url && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <Play className="h-4 w-4 mr-1" />
                            Video Demo
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No workflows available yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
