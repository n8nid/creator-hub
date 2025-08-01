import { useState, useEffect } from "react";
import { useEvents, Event } from "./use-events";

export function useUpcomingEvents(limit?: number) {
  const { events, loading, error } = useEvents(limit || 50);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (events.length > 0) {
      // Filter upcoming events (events that haven't happened yet)
      const now = new Date();
      const filtered = events.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate > now && event.status === 'published';
      });

      // Sort events by date (earliest first)
      const sorted = filtered.sort((a, b) => {
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      });

      setUpcomingEvents(sorted);
    } else {
      setUpcomingEvents([]);
    }
  }, [events]);

  return { 
    upcomingEvents, 
    loading, 
    error,
    totalEvents: events.length,
    featuredEvents: events.filter(e => e.is_featured).length
  };
} 