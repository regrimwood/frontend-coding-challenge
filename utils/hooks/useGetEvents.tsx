import { useEffect, useState } from "react";
import { API_URL } from "../globals";
import { EventBriefModel } from "../models/EventModel";

export default function useGetEvents() {
  const [events, setEvents] = useState<EventBriefModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const getEvents = async () => {
      try {
        const url = `${API_URL}/events`;
        const res = await fetch(url);

        if (!res?.ok) {
          throw new Error(res.statusText);
        }

        const data: EventBriefModel[] = await res.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  return { events, loading };
}
