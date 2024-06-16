import { API_URL } from "utils/globals";
import { EventModel } from "utils/models/EventModel";

export default async function getEvent({ id }: { id: string }) {
  try {
    const url = `${API_URL}/events/${id}`;
    const res = await fetch(url);

    if (!res?.ok) {
      throw new Error(res.statusText);
    }

    const event: EventModel = await res.json();
    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error: any) {
    throw new Error(error?.message ?? "An error occurred");
  }
}
