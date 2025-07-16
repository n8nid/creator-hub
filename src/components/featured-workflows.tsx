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
        .select("id, title, description")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(4);
      setWorkflows(data || []);
    };
    fetchWorkflows();
  }, []);

  return (
    <section className="py-16 content-above-gradient">
      <div className="w-full px-16 relative z-10">
        <div className="flex flex-col items-start justify-start mb-12">
          <div className="flex flex-row items-center justify-between w-full gap-6">
            <h2
              style={{
                fontFamily: "Albert Sans, Arial, sans-serif",
                fontWeight: 300,
                fontStyle: "normal",
                fontSize: 80,
                lineHeight: "120%",
                letterSpacing: 0,
                color: "#FFFFFF",
                textAlign: "left",
                margin: 0,
                padding: 0,
                flex: 1,
                minWidth: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Explore Workflow
            </h2>
            <Link
              href="/workflows"
              className="btn-jelajah flex items-center gap-3"
              style={{ height: 60 }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700
                         hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <svg
                  className="h-8 w-8 text-blue-600 mr-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 17V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-white">
                  {workflow.title}
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {workflow.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkflows;
