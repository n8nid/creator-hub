import { useState, useEffect } from "react";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived" | "cancelled";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
}

export function useEvents(limit?: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL("/api/events", window.location.origin);
        if (limit) {
          url.searchParams.set("limit", limit.toString());
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  return { events, loading, error };
}
