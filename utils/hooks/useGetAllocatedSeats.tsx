import { useEffect, useState } from "react";
import { API_URL } from "utils/globals";
import {
  AllocatedSeatModel,
  AllocatedSeatWithPricesModel,
} from "utils/models/AllocatedSeatModel";

export default function useGetAllocatedSeats({ ids }: { ids: number[] }) {
  const [seats, setSeats] = useState<AllocatedSeatWithPricesModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let timeoutId: ReturnType<typeof setTimeout>;

    const getSeats = async () => {
      const newSeats = [];

      for (let id of ids) {
        const prices = [];

        try {
          const url = `${API_URL}/allocated-seats/${id}`;
          const res = await fetch(url);

          if (!res?.ok) {
            throw new Error(res.statusText);
          }

          const seat: AllocatedSeatModel = await res.json();

          if (seat.priceIds?.length) {
            for (let priceId of seat.priceIds) {
              const priceUrl = `${API_URL}/prices/${priceId}`;
              const priceRes = await fetch(priceUrl);

              if (!priceRes?.ok) {
                throw new Error(priceRes.statusText);
              }

              const price = await priceRes.json();
              prices.push(price);
            }
          }

          newSeats.push({ ...seat, prices });
        } catch (error) {
          console.error(error);
        }
      }

      setSeats(newSeats);
      timeoutId = setTimeout(() => setLoading(false), 200);
    };

    getSeats();
    return () => clearTimeout(timeoutId);
  }, [ids]);

  return { seats, loading };
}
