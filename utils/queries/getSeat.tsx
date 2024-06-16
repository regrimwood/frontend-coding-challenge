import { API_URL } from "utils/globals";
import { AllocatedSeatModel } from "utils/models/AllocatedSeatModel";

export default async function getSeat({ id }: { id: number }) {
  try {
    const url = `${API_URL}/allocated-seats/${id}`;
    const res = await fetch(url);

    if (!res?.ok) {
      throw new Error(res.statusText);
    }

    const seat: AllocatedSeatModel = await res.json();

    if (!seat) {
      throw new Error("Seat not found");
    }

    return seat;
  } catch (error: any) {
    throw new Error(error?.message ?? "An error occurred");
  }
}
