import { API_URL } from "utils/globals";
import { GeneralAdmissionAreaModel } from "utils/models/GeneralAdmissionAreaModel";

export default async function getGAArea({ id }: { id: number }) {
  try {
    const url = `${API_URL}/ga-areas/${id}`;
    const res = await fetch(url);

    if (!res?.ok) {
      throw new Error(res.statusText);
    }

    const gaArea: GeneralAdmissionAreaModel = await res.json();

    if (!gaArea) {
      throw new Error("General Admission Area not found");
    }

    return gaArea;
  } catch (error: any) {
    throw new Error(error?.message ?? "An error occurred");
  }
}
