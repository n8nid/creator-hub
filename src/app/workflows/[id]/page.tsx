"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workflow, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function WorkflowDetailPublicPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const workflowId = params?.id as string;
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!workflowId) return;
      const { data } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", workflowId)
        .single();
      setWorkflow(data);
      setLoading(false);
    };
    fetchWorkflow();
  }, [workflowId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  if (!workflow) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        Workflow tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="outline"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.push("/workflows")}
      >
        {" "}
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Workflow{" "}
      </Button>
      <Card className="overflow-hidden">
        {/* Header gradient + icon + judul */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
            <Workflow className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
              {workflow.title}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full">
                {workflow.complexity || "-"}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                {workflow.status}
              </span>
              {(workflow.tags || []).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-white border border-gray-200 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <CardContent className="pt-8">
          {workflow.screenshot_url && (
            <img
              src={workflow.screenshot_url}
              alt="Screenshot"
              className="rounded-xl mb-6 w-full max-h-80 object-cover shadow"
            />
          )}
          <div className="mb-6 text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {workflow.description}
          </div>
          {workflow.video_url && (
            <div className="mb-6">
              <video
                src={workflow.video_url}
                controls
                className="rounded-xl w-full max-h-80 shadow"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-4 items-center mb-6 text-sm text-gray-500">
            <div>Created: {workflow.created_at?.slice(0, 10)}</div>
            <div>Updated: {workflow.updated_at?.slice(0, 10)}</div>
          </div>
          {/* Preview n8n workflow jika ada json_n8n */}
          {workflow.json_n8n && (
            <div className="mt-6 border rounded bg-gray-50 p-4 overflow-x-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                    /'/g,
                    "&#39;"
                  )}' frame="true"></n8n-demo>`,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
