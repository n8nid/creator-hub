"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Workflow } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Custom Arrow Components to avoid carouselState prop issues
const CustomLeftArrow = React.forwardRef<HTMLButtonElement, any>(
  (props, ref) => {
    const { onClick, carouselState, rtl, ...rest } = props;
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
        {...rest}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );
  }
);

const CustomRightArrow = React.forwardRef<HTMLButtonElement, any>(
  (props, ref) => {
    const { onClick, carouselState, rtl, ...rest } = props;
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all duration-300 z-10"
        {...rest}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  }
);

CustomLeftArrow.displayName = "CustomLeftArrow";
CustomRightArrow.displayName = "CustomRightArrow";

const FeaturedWorkflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1536 },
      items: 4,
      slidesToSlide: 1,
    },
    desktop: {
      breakpoint: { max: 1536, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data } = await supabase
        .from("workflows")
        .select("id, title, description, category, tags, profile_id")
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
    <section className="pt-[17.063rem] content-above-gradient">
      <div className="w-full container-box relative z-10">
        <div className="flex flex-col items-start justify-start mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
            <h2 className="h2-title sm:text-start text-center w-full">
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
        </div>

        <div className="mt-[7.313rem] w-full">
          <Carousel
            responsive={responsive}
            className="w-full"
            itemClass="px-3"
            containerClass="carousel-container"
            infinite={true}
            autoPlay={false}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={300}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            draggable={true}
            swipeable={true}
            centerMode={false}
            focusOnSelect={false}
            ssr={true}
            showDots={false}
            arrows={true}
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
          >
            {workflows.map((workflow, index) => (
              <div key={workflow.id} className="h-full">
                <Link
                  href={`/workflows/${workflow.id}`}
                  className={`group relative rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden block h-full ${
                    index === workflows.length - 1 ? "bg-[#959DA1]" : ""
                  }`}
                >
                  {/* Content */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Category Badge */}
                    <div className="flex justify-end mb-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-black text-white rounded-full">
                        {workflow.category || "General"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-purple-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors flex-grow">
                      {workflow.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {workflow.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros."}
                    </p>

                    {/* Tags */}
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

                    {/* Author */}
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
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkflows;
