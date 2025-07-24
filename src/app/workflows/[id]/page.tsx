"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GradientCircle from "@/components/GradientCircle";
import ReactMarkdown from "react-markdown";

export default function WorkflowDetailPublicPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const workflowId = params?.id as string;
  const [workflow, setWorkflow] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflowAndCreator = async () => {
      if (!workflowId) return;

      try {
        // Fetch workflow
        const { data: workflowData, error: workflowError } = await supabase
          .from("workflows")
          .select("*")
          .eq("id", workflowId)
          .single();

        if (workflowError) {
          console.error("Error fetching workflow:", workflowError);
          return;
        }

        setWorkflow(workflowData);
        console.log("Workflow data:", workflowData); // Debug log

        // Fetch creator profile if workflow has profile_id
        if (workflowData?.profile_id) {
          console.log(
            "Fetching creator with profile_id:",
            workflowData.profile_id
          ); // Debug log

          const { data: creatorData, error: creatorError } = await supabase
            .from("profiles")
            .select("name, profile_image, experience_level")
            .eq("id", workflowData.profile_id)
            .single();

          if (creatorError) {
            console.error("Error fetching creator:", creatorError);
          } else {
            console.log("Creator data:", creatorData); // Debug log
            setCreator(creatorData);
          }
        } else {
          console.log("No profile_id found in workflow"); // Debug log
        }
      } catch (error) {
        console.error("Error in fetchWorkflowAndCreator:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowAndCreator();
  }, [workflowId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <GradientCircle
          type="hero"
          style={{
            top: "50px",
            left: "35%",
            transform: "translateX(-50%)",
            zIndex: -1,
          }}
        />
        <div className="container mx-auto px-4 py-8 text-white text-center">
          Loading...
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <GradientCircle
          type="hero"
          style={{
            top: "50px",
            left: "35%",
            transform: "translateX(-50%)",
            zIndex: -1,
          }}
        />
        <div className="container mx-auto px-4 py-8 text-white text-center">
          Workflow tidak ditemukan.
        </div>
      </div>
    );
  }

  const getInitials = (nameOrEmail: string) => {
    if (!nameOrEmail) return "?";
    const parts = nameOrEmail.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatExperienceLevel = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      case "expert":
        return "Expert";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative mt-[7.813rem]">
      {/* Circle Gradient di atas */}
      <GradientCircle
        type="hero"
        style={{
          top: "50px",
          left: "35%",
          transform: "translateX(-50%)",
          zIndex: -1,
        }}
      />

      <main className="flex-grow relative z-10">
        <div className="container-box">
          {/* Bagian 1: Judul + Workflow Canvas */}
          <div className="flex xl:flex-row flex-col gap-8 mb-12 h-[45rem] sm:h-[45rem] md:h-[34rem] lg:h-[34rem]">
            {/* Kiri - Judul */}
            <div className="flex flex-col justify-start lg:col-span-2 w-full xl:w-[50%]">
              {/* Back to Workflows Button */}

              {/* Workflow Title */}
              <h3 className="h3 text-white">{workflow.title}</h3>

              {/* Garis Pendek */}
              <div className="w-[10.063rem] h-0.5 mt-[3.438rem] bg-white/40 mb-8"></div>
            </div>

            {/* Kanan - Workflow Canvas */}
            <div className="rounded-2xl w-full xl:w-[50%]">
              {workflow.screenshot_url ? (
                <img
                  src={workflow.screenshot_url}
                  alt="Workflow Screenshot"
                  className="w-full h-auto object-cover"
                />
              ) : workflow.json_n8n ? (
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16/8" }}
                >
                  <div
                    className=" w-full h-full inset-0"
                    dangerouslySetInnerHTML={{
                      __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                        /'/g,
                        "&#39;"
                      )}' frame="true" style="width: 100%; height: 100%; border: none; border-radius: 0; margin: 0; padding: 0; overflow: hidden;"></n8n-demo>`,
                    }}
                  />
                </div>
              ) : (
                <div
                  className="flex items-center justify-center p-8"
                  style={{ aspectRatio: "16/10" }}
                >
                  <div className="text-gray-500 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg">No workflow preview available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bagian 2: Info Creator + Deskripsi */}
          <div className="flex xl:flex-row flex-col gap-8">
            {/* Kiri - Info Creator, Last Update, Categories */}

            {/* Kanan - Deskripsi Workflow */}
            <div className="pr-6 w-full xl:w-[50%]">
              <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="font-bold text-white mb-4  workflow-h1">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-bold text-white mb-3 workflow-h2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-bold text-white mb-2 workflow-h3">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-white/80 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside text-white/80 mb-4 space-y-1 ml-4">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside text-white/80 mb-4 space-y-1 ml-4">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-white/80">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-white">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-white/90">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-white/10 text-white px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-white/10 text-white p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-purple-300 hover:text-purple-200 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-400 pl-4 italic text-white/70 mb-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {workflow.description ||
                    "Tidak ada deskripsi yang tersedia untuk workflow ini."}
                </ReactMarkdown>
              </div>
            </div>
            <div className="w-[50%]">
              <div>
                {/* Creator Profile Section */}
                {creator ? (
                  <div>
                    <button
                      onClick={() =>
                        router.push(`/creators/${workflow.profile_id}`)
                      }
                      className="creator-item"
                      style={{ padding: 0 }}
                    >
                      <div className="creator-avatar">
                        <Avatar className="creator-avatar-image">
                          <AvatarImage
                            src={creator.profile_image || ""}
                            alt={creator.name || "Creator"}
                          />
                          <AvatarFallback className="creator-avatar-fallback">
                            {getInitials(creator.name || "Creator")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="creator-info">
                        <h3 className="creator-name">
                          {creator.name || "Unknown Creator"}
                        </h3>
                        <p className="creator-experience">
                          {formatExperienceLevel(creator.experience_level)}
                        </p>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="creator-item" style={{ padding: 0 }}>
                      <div className="creator-avatar">
                        <Avatar className="creator-avatar-image">
                          <AvatarFallback className="creator-avatar-fallback">
                            ?
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="creator-info">
                        <h3 className="creator-name">Unknown Creator</h3>
                        <p className="creator-experience">Unknown</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Update */}
                {/* <div>
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">
                  Last Update
                </h3>
                <p className="text-white">
                  Last update{" "}
                  {formatDate(workflow.updated_at || workflow.created_at)}
                </p>
              </div> */}

                {/* Categories */}
                {/* <div>
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {workflow.category ? (
                    <span className="px-3 py-1 text-sm bg-white/10 border border-white/20 text-white rounded-lg">
                      {workflow.category}
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm bg-white/10 border border-white/20 text-white rounded-lg">
                      General
                    </span>
                  )}
                </div>
              </div> */}
              </div>
              <p className="text-white/80 mt-8">
                dipublish pada {formatPublishedDate(workflow.created_at)}
              </p>

              {/* Lihat Profile Button */}
              <button
                className="btn-jelajah w-full flex items-center justify-center gap-3 sm:w-[280px] rounded-full mt-[23px]"
                onClick={() => router.push(`/creators/${workflow.profile_id}`)}
              >
                Lihat Profile
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.889 13.454V8.11m0 0H6.546m5.343 0-7.9 7.9m4.352 2.326a8.5 8.5 0 1 0-6.678-6.678"
                  ></path>
                  <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.05"
                    strokeWidth="2"
                    d="M11.889 13.454V8.11m0 0H6.546m5.343 0-7.9 7.9m4.352 2.326a8.5 8.5 0 1 0-6.678-6.678"
                  ></path>
                </svg>
              </button>

              {/* Download Workflow Button */}
              <button
                className="btn-jelajah-workflow w-full flex items-center justify-center gap-3 sm:w-[280px] rounded-full mt-[23px]"
                onClick={() => {
                  if (workflow.json_n8n) {
                    const blob = new Blob([workflow.json_n8n], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${workflow.title || "workflow"}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }
                }}
                disabled={!workflow.json_n8n}
              >
                Download Workflow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="#622a9a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 2.5v10.833m0 0L6.667 10m3.333 3.333L13.333 10"
                  />
                  <path
                    stroke="#622a9a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.5 10c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5 7.5 3.358 7.5 7.5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
