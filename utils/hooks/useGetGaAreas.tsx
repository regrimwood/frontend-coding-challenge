import { useEffect, useState } from "react";
import { API_URL } from "utils/globals";
import {
  GeneralAdmissionAreaModel,
  GeneralAdmissionAreaWithPricesModel,
} from "utils/models/GeneralAdmissionAreaModel";

export default function useGetGaAreas({ ids }: { ids: number[] }) {
  const [gaAreas, setGaAreas] = useState<GeneralAdmissionAreaWithPricesModel[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let timeoutId: ReturnType<typeof setTimeout>;

    const getGaAreas = async () => {
      const areas = [];

      for (let id of ids) {
        const prices = [];

        try {
          const url = `${API_URL}/ga-areas/${id}`;
          const res = await fetch(url);

          if (!res?.ok) {
            throw new Error(res.statusText);
          }

          const gaArea: GeneralAdmissionAreaModel = await res.json();

          if (gaArea.priceIds?.length) {
            for (let priceId of gaArea.priceIds) {
              const priceUrl = `${API_URL}/prices/${priceId}`;
              const priceRes = await fetch(priceUrl);

              if (!priceRes?.ok) {
                throw new Error(priceRes.statusText);
              }

              const price = await priceRes.json();
              prices.push(price);
            }
          }

          areas.push({ ...gaArea, prices });
        } catch (error) {
          console.error(error);
        }
      }

      setGaAreas(areas);
      timeoutId = setTimeout(() => setLoading(false), 200);
    };

    getGaAreas();
    return () => clearTimeout(timeoutId);
  }, [ids]);

  return { gaAreas, loading };
}
