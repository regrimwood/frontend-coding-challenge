"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EventModel } from "utils/models/EventModel";
import useGetGaAreas from "utils/hooks/useGetGaAreas";
import Button from "./Button";
import { AnimatePresence } from "framer-motion";
import Transition, { transitionVariants } from "./AnimationTransition";
import Spinner from "../assets/icons/spinner.svg";
import Typography from "./Typography";
import { PriceModel } from "utils/models/PriceModel";
import useMediaQuery from "utils/hooks/useMediaQuery";
import tailwindConfig from "tailwind.config";
import Select from "./Select";

function DesktopPriceRow({ price }: { price: PriceModel }) {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  return (
    <tr>
      <td>{price.priceName}</td>
      <td>${price.price}</td>
      <td>
        <Select
          selected={selectedQuantity}
          onSelect={(v) => setSelectedQuantity(v)}
          options={Array.from({ length: 11 }, (_, i) => ({
            label: i.toString(),
            value: i,
          }))}
        />
      </td>
      <td className="flex justify-end">
        <Button>Add to cart</Button>
      </td>
    </tr>
  );
}

function DesktopPriceList({ prices }: { prices: PriceModel[] }) {
  return (
    <table className="w-full border-separate border-spacing-y-10">
      <thead>
        <tr>
          <th className="p-0 text-left w-1/4">Type</th>
          <th className="p-0 text-left w-1/4">Price</th>
          <th className="p-0 text-left w-1/4">Quantity</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {prices?.length > 0 &&
          prices.map((price) => (
            <DesktopPriceRow key={price.id} price={price} />
          ))}
      </tbody>
    </table>
  );
}

function MobilePriceRow({ price }: { price: PriceModel }) {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  return (
    <li className="block rounded-2xl border-[1px] border-lightPurple p-3">
      <div className="flex gap-3 justify-between items-center mb-3">
        <Typography variant="body2" className="font-medium">
          {price.priceName}
        </Typography>
        <Typography variant="body2" className="text-violet">
          ${price.price}
        </Typography>
      </div>
      <div className="flex gap-3 justify-between items-center">
        <div className="  w-2/5">
          <Select
            selected={selectedQuantity}
            onSelect={(v) => setSelectedQuantity(v)}
            options={Array.from({ length: 11 }, (_, i) => ({
              label: i.toString(),
              value: i,
            }))}
          />
        </div>
        <Button>Add to cart</Button>
      </div>
    </li>
  );
}

function MobilePriceList({ prices }: { prices: PriceModel[] }) {
  return (
    <ul className="w-full flex flex-col gap-3">
      {prices?.length > 0 &&
        prices.map((price) => <MobilePriceRow key={price.id} price={price} />)}
    </ul>
  );
}

export default function GAEventDetails({
  event,
  setSubtitle,
}: {
  event: EventModel;
  setSubtitle: (subtitle: string) => void;
}) {
  const { gaAreaIds } = event;
  const { gaAreas, loading } = useGetGaAreas({ ids: gaAreaIds });

  const [selectedArea, setSelectedArea] = useState<number>(0);

  const isMd = useMediaQuery(`(min-width: ${tailwindConfig.theme.screens.md})`);

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
      <AnimatePresence mode="wait">
        {loading && (
          <Transition key="loading">
            <Spinner class="text-violet" />
          </Transition>
        )}
        {!loading && gaAreas && (
          <Transition key="content">
            <div className="mb-7 md:mb-10">
              <ul className="flex flex-col md:flex-row gap-2 md:gap-4">
                {gaAreas.map((area, i) => (
                  <li key={area.id}>
                    <Button
                      className="w-full md:w-auto"
                      selected={selectedArea === i}
                      onClick={() => setSelectedArea(i)}
                    >
                      {area.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              variants={transitionVariants}
              className="bg-white rounded-lg p-5 md:p-8"
            >
              <Typography variant="h4" className="mb-3 md:mb-5">
                {gaAreas[selectedArea]?.name} Tickets
              </Typography>

              {isMd ? (
                <DesktopPriceList prices={gaAreas[selectedArea]?.prices} />
              ) : (
                <MobilePriceList prices={gaAreas[selectedArea]?.prices} />
              )}
            </motion.div>
          </Transition>
        )}
      </AnimatePresence>
    </div>
  );
}
