import React from "react";
import { HeaderNav } from "@/components/header-nav";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import FeaturedWorkflows from "@/components/featured-workflows";
import FeaturedCreators from "@/components/featured-creators";
import MainFooter from "@/components/main-footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNav />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <FeaturedWorkflows />
        <FeaturedCreators />
      </main>
      <MainFooter />
    </div>
  );
}
