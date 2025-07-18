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
            .select("name, profile_image")
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

  return (
    <div className="min-h-screen flex flex-col relative">
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Bagian 1: Judul + Workflow Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Kiri - Judul */}
            <div className="flex flex-col justify-center lg:col-span-2">
              {/* Back to Workflows Button */}
              <Button
                variant="ghost"
                className="mb-6 flex items-center gap-2 text-white hover:text-white/80 hover:bg-white/10 w-fit"
                onClick={() => router.push("/workflows")}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Workflows
              </Button>

              {/* Workflow Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight mb-8">
                {workflow.title}
              </h1>

              {/* Garis Pendek */}
              <div className="w-16 h-0.5 bg-white/40 mb-8"></div>
            </div>

            {/* Kanan - Workflow Canvas */}
            <div className="lg:col-span-3 bg-white rounded-2xl overflow-hidden shadow-lg">
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
                    className="absolute inset-0"
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Kiri - Info Creator, Last Update, Categories */}
            <div className="lg:col-span-2 space-y-4">
              {/* Creator Profile Section */}
              {creator ? (
                <div>
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
                    Created by
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm w-fit">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={creator.profile_image || undefined}
                        alt={creator.name || "Creator"}
                      />
                      <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                        {getInitials(creator.name || "Creator")}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() =>
                        router.push(`/talent/${workflow.profile_id}`)
                      }
                      className="text-base font-semibold text-white hover:text-white/80 transition-colors cursor-pointer"
                    >
                      {creator.name || "Unknown Creator"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
                    Created by
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm w-fit">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                        ?
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-base font-semibold text-white">
                      Unknown Creator
                    </span>
                  </div>
                </div>
              )}

              {/* Last Update */}
              <div>
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">
                  Last Update
                </h3>
                <p className="text-white">
                  Last update{" "}
                  {formatDate(workflow.updated_at || workflow.created_at)}
                </p>
              </div>

              {/* Categories */}
              <div>
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
              </div>
            </div>

            {/* Kanan - Deskripsi Workflow */}
            <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-white mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-white mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold text-white mb-2">
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
          </div>
        </div>
      </main>
    </div>
  );
}
