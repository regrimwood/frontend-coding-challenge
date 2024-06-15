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

    return event;
  } catch (error) {
    console.error(error);
  }
}
