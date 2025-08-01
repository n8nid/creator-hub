import { useState, useEffect } from "react";

export interface FeaturedContent {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  type: "news" | "event";
  display_date: string;
  excerpt?: string;
  description?: string;
}

export function useFeaturedContent() {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/news/featured");

        if (!response.ok) {
          throw new Error("Failed to fetch featured content");
        }

        const data = await response.json();
        setFeaturedContent(data.featured || []);
      } catch (err) {
        console.error("Error fetching featured content:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return { featuredContent, loading, error };
}
