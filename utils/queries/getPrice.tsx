import { API_URL } from "utils/globals";
import { PriceModel } from "utils/models/PriceModel";

export default async function getPrice({ id }: { id: number }) {
  try {
    const url = `${API_URL}/prices/${id}`;
    const res = await fetch(url);

    if (!res?.ok) {
      throw new Error(res.statusText);
    }

    const price: PriceModel = await res.json();

    if (!price) {
      throw new Error("Price not found");
    }

    return price;
  } catch (error: any) {
    throw new Error(error?.message ?? "An error occurred");
  }
}
