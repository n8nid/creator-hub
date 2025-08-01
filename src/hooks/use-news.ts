import { useState, useEffect } from "react";

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  published_date: string;
  image_url: string | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
}

export function useNews(limit?: number) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL("/api/news", window.location.origin);
        if (limit) {
          url.searchParams.set("limit", limit.toString());
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [limit]);

  return { news, loading, error };
}
