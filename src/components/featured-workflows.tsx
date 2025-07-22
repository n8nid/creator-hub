"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Workflow } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const FeaturedWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data } = await supabase
        .from("workflows")
        .select("id, title, description, category, tags, profile_id")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(4);

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
    <section className="py-16 content-above-gradient">
      <div className="w-full px-4 sm:px-8 md:px-16 relative z-10">
        <div className="flex flex-col items-start justify-start mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
            <h2 className="explore-workflow-title text-white flex-1 min-w-0">
              Explore Workflow
            </h2>
            <Link
              href="/workflows"
              className="btn-jelajah button-text flex items-center gap-3 w-full sm:w-auto justify-center button-height-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              Jelajahi Workflow
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflows.map((workflow) => (
            <Link
              key={workflow.id}
              href={`/workflows/${workflow.id}`}
              className="workflow-card block w-full"
            >
              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex justify-end mb-4">
                  <span className="workflow-category-badge workflow-category-text">
                    {workflow.category || "General"}
                  </span>
                </div>
                {/* Title */}
                <h3 className="workflow-title-text mb-2 group-hover:text-purple-700 transition-colors break-words">
                  {workflow.title}
                </h3>

                {/* Description */}
                <p className="workflow-description-text mb-4 line-clamp-3">
                  {workflow.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                </p>

                {/* Tags */}
                <div className="workflow-tags-container">
                  {(workflow.tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="workflow-tag workflow-tag-text">
                      {tag}
                    </span>
                  ))}
                  {(workflow.tags || []).length > 3 && (
                    <span className="workflow-tag workflow-tag-text">
                      +{(workflow.tags || []).length - 3}
                    </span>
                  )}
                </div>

                {/* Author */}
                <div className="workflow-author-section">
                  <div className="workflow-author-avatar">
                    {workflow.profile_image ? (
                      <img
                        src={workflow.profile_image}
                        alt={workflow.profile_name || "Creator"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="workflow-author-avatar">
                        {workflow.profile_name?.charAt?.(0) || "C"}
                      </span>
                    )}
                  </div>
                  <span className="workflow-creator-text">
                    {workflow.profile_name || "Creator"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkflows;
