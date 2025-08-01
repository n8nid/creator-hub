"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Workflow } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const FeaturedWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Workflows Carousel navigation with horizontal scroll
  const nextWorkflow = () => {
    const container = document.getElementById("workflows-container");
    if (container) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      const scrollAmount = cardWidth + gap;
      container.scrollLeft += scrollAmount;
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const prevWorkflow = () => {
    const container = document.getElementById("workflows-container");
    if (container) {
      const cardWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      const scrollAmount = cardWidth + gap;
      container.scrollLeft -= scrollAmount;
      setScrollPosition(container.scrollLeft - scrollAmount);
    }
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data } = await supabase
        .from("workflows")
        .select(
          "id, title, description, category, tags, profile_id, json_n8n, screenshot_url"
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(8);

      // Fetch profile data for each workflow
      if (data && data.length > 0) {
        const profileIds = [...new Set(data.map((w) => w.profile_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name, profile_image")
          .in("id", profileIds);

        const profilesMap = (profiles || []).reduce((acc: any, p: any) => {
          acc[p.id] = { name: p.name, profile_image: p.profile_image };
          return acc;
        }, {});

        const workflowsWithProfiles = data.map((w) => ({
          ...w,
          profile_name: profilesMap[w.profile_id]?.name || "Unknown Creator",
          profile_image: profilesMap[w.profile_id]?.profile_image || null,
        }));

        setWorkflows(workflowsWithProfiles);
      }
    };
    fetchWorkflows();
  }, []);

  return (
    <section className="featured-workflows-section content-above-gradient">
      <div className="featured-workflows-container container-box">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between mb-8 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
          <h2 className="h2-title text-center md:text-start w-full">
            Explore Workflow
          </h2>
          <Link href="/workflows" className="btn-primary">
            Jelajahi Workflow
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3889 13.4538V8.11112M11.3889 8.11112H6.0463M11.3889 8.11112L3.48959 16.0105M7.84079 18.3374C10.5298 18.87 13.4265 18.0943 15.5104 16.0105C18.8299 12.6909 18.8299 7.30906 15.5104 3.9896C12.1909 0.670134 6.80904 0.670134 3.48959 3.9896C1.4057 6.07349 0.630042 8.97019 1.16259 11.6592"
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="featured-workflows-carousel-section">
          {/* Horizontal Scrollable Workflows */}
          <div className="flex items-center gap-0">
            {/* Left Navigation Arrow */}
            <button
              onClick={prevWorkflow}
              className="w-6 md:w-8 lg:w-10 h-12 md:h-16 lg:h-20 bg-gradient-to-r from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center hover:from-white/30 hover:to-transparent transition-all duration-200 group flex-shrink-0"
            >
              <svg
                className="w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 text-white transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Workflows Container */}
            <div
              id="workflows-container"
              className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-4 scroll-smooth flex-1"
            >
              {workflows.map((workflow, index) => (
                <Link
                  key={workflow.id}
                  href={`/workflows/${workflow.id}`}
                  className="group relative rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 block overflow-hidden h-full flex-shrink-0 w-80"
                >
                  {/* Div 1: Workflow Preview Diagram (Full Width) */}
                  <div className="w-full relative workflow-preview-section overflow-hidden">
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-black text-white rounded-full">
                        {workflow.category || "General"}
                      </span>
                    </div>

                    {/* Workflow Diagram Preview */}
                    <div className="w-full -top-4 lg:top-0 absolute min-h-72">
                      <div className="bg-gray-50 border-b border-gray-200 workflow-preview-header">
                        {/* Div wrapper dengan posisi relative untuk workflow preview */}
                        <div className="h-full workflow-preview-wrapper">
                          <div className="workflow-preview-container workflow-preview-transform">
                            {workflow.screenshot_url ? (
                              <div className="workflow-preview-content absolute w-full h-full">
                                <img
                                  src={workflow.screenshot_url}
                                  alt={`Preview workflow ${workflow.title}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : workflow.json_n8n ? (
                              <div
                                className="workflow-preview-content absolute -translate-x-48  min-w-[1000px] h-full"
                                dangerouslySetInnerHTML={{
                                  __html: `<n8n-demo workflow='${workflow.json_n8n.replace(
                                    /'/g,
                                    "&#39;"
                                  )}' frame="true" style="width: 100%; height: 100%; border: none; border-radius: 0; margin: 0; padding: 0; overflow: hidden; display: block;"></n8n-demo>`,
                                }}
                              />
                            ) : (
                              <div className="workflow-preview-content absolute w-full h-full flex items-center justify-center bg-gray-100">
                                <div className="text-center text-gray-500">
                                  <div className="text-2xl mb-1">📋</div>
                                  <p className="text-xs">No workflow data</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    json_n8n field empty
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Add workflow JSON to see preview
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Div 2: Workflow Info (Full Width) */}
                  <div className="w-full p-6 h-full flex flex-col">
                    <h3 className="text-lg font-bold text-purple-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors flex-grow">
                      {workflow.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {workflow.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(workflow.tags || []).slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {(workflow.tags || []).length > 3 && (
                        <span className="px-3 py-1 text-xs bg-gray-200 text-purple-700 rounded-full font-medium">
                          +{(workflow.tags || []).length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        {workflow.profile_image ? (
                          <img
                            src={workflow.profile_image}
                            alt={workflow.profile_name || "Creator"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                            {workflow.profile_name?.charAt?.(0) || "C"}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-purple-900 font-medium">
                        {workflow.profile_name || "Creator"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={nextWorkflow}
              className="w-6 md:w-8 lg:w-10 h-12 md:h-16 lg:h-20 bg-gradient-to-r from-transparent to-white/20 backdrop-blur-sm flex items-center justify-center hover:from-transparent hover:to-white/30 transition-all duration-200 group flex-shrink-0"
            >
              <svg
                className="w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 text-white transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkflows;
