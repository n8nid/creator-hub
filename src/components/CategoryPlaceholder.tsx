"use client";

import React from "react";
import {
  Brain,
  Server,
  Globe,
  Wrench,
  Workflow,
  Shield,
  Bot,
  Code2,
} from "lucide-react";

type Props = {
  category?: string | null;
  label?: string;
};

function getIconByCategory(category?: string | null) {
  const key = (category || "").toLowerCase();
  if (key.includes("ai")) return Brain;
  if (key.includes("ops") || key.includes("devops")) return Server;
  if (key.includes("web")) return Globe;
  if (key.includes("security")) return Shield;
  if (key.includes("bot") || key.includes("automation")) return Bot;
  if (key.includes("dev") || key.includes("code")) return Code2;
  if (key.includes("it")) return Wrench;
  return Workflow;
}

export default function CategoryPlaceholder({
  category,
  label = "No Image",
}: Props) {
  const Icon = getIconByCategory(category);
  return (
    <div className="workflow-preview-content absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center shadow-sm">
          <Icon className="w-7 h-7 text-gray-500" />
        </div>
        <span className="px-2 py-0.5 rounded bg-white/70 text-gray-600 text-xs">
          {label}
        </span>
        {category ? (
          <span className="text-[10px] text-gray-400">{category}</span>
        ) : null}
      </div>
    </div>
  );
}
