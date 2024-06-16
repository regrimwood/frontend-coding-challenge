import { useEffect, useState } from "react";
import { API_URL } from "utils/globals";
import {
  AllocatedSeatModel,
  AllocatedSeatWithPricesModel,
} from "utils/models/AllocatedSeatModel";
import { PriceModel } from "utils/models/PriceModel";

export default function useGetAllocatedSeats({ ids }: { ids: number[] }) {
  const [seats, setSeats] = useState<AllocatedSeatWithPricesModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let timeoutId: ReturnType<typeof setTimeout>;

    const getSeats = async () => {
      const newSeats = [];
      const allPricesList: PriceModel[] = [];

      for (let id of ids) {
        const seatPrices = [];

        try {
          const url = `${API_URL}/allocated-seats/${id}`;
          const res = await fetch(url);

          if (!res?.ok) {
            throw new Error(res.statusText);
          }

          const seat: AllocatedSeatModel = await res.json();

          if (seat.priceIds?.length) {
            for (let priceId of seat.priceIds) {
              const savedPrice = allPricesList.find((v) => v.id === priceId);

              if (savedPrice) {
                seatPrices.push(savedPrice);
                continue;
              }

              const priceUrl = `${API_URL}/prices/${priceId}`;
              const priceRes = await fetch(priceUrl);

              if (!priceRes?.ok) {
                throw new Error(priceRes.statusText);
              }

              const price = await priceRes.json();
              seatPrices.push(price);
              allPricesList.push(price);
            }
          }

          newSeats.push({ ...seat, prices: seatPrices });
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
