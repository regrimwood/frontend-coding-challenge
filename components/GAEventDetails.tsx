import { useEffect } from "react";
import { EventModel } from "utils/models/EventModel";
import useGetGaAreas from "utils/hooks/useGetGaAreas";

export default function GAEventDetails({
  event,
  setSubtitle,
}: {
  event: EventModel;
  setSubtitle: (subtitle: string) => void;
}) {
  const { gaAreaIds } = event;
  const { gaAreas, loading } = useGetGaAreas({ ids: gaAreaIds });

  useEffect(() => {
    console.log(gaAreas);
    if (gaAreas?.length) {
      const prices = gaAreas.flatMap((area) => area.prices);
      const lowestPrice = prices.reduce((acc, price) => {
        return price.price < acc.price ? price : acc;
      });
      const highestPrice = prices.reduce((acc, price) => {
        return price.price > acc.price ? price : acc;
      });
      setSubtitle(`$${lowestPrice.price} - $${highestPrice.price}`);
    }
  }, [gaAreas]);

  return (
    <div>
      <h2>General Admission Areas</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {gaAreas.map((area) => (
            <li key={area.id}>
              <h3>{area.name}</h3>
              <p>Capacity: {area.capacity}</p>
              <ul>
                {area.prices.map((price) => (
                  <li key={price.id}>
                    <p>{price.price}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
