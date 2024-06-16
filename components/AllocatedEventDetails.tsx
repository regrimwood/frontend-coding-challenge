import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { EventModel } from "utils/models/EventModel";
import Typography from "./Typography";
import { AllocatedSeatWithPricesModel } from "utils/models/AllocatedSeatModel";
import { AllocatedSeatStatusEnum } from "utils/models/AllocatedSeatStatusEnum";
import useGetAllocatedSeats from "utils/hooks/useGetAllocatedSeats";
import Transition from "./AnimationTransition";
import Spinner from "../assets/icons/spinner.svg";
import formatToNZD from "utils/formatToNZD";
import Button from "./Button";
import CloseIcon from "../assets/icons/close.svg";
import { useCart } from "./CartContext";
import { EventTypeEnum } from "utils/models/EventTypeEnum";

function SeatPopup({
  seat,
  setSelectedSeat,
  eventId,
}: {
  seat: AllocatedSeatWithPricesModel;
  setSelectedSeat: (seat: AllocatedSeatWithPricesModel | undefined) => void;
  eventId: number;
}) {
  const { addToCart } = useCart();

  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddToCart = async (priceId: number) => {
    setLoading(true);

    try {
      const result = await addToCart({
        eventId,
        seatId: seat.id,
        priceId,
        quantity: 1,
      });

      if (!result) {
        throw new Error("An error occurred");
      }
    } catch (e: any) {
      setError(e?.message ?? "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-fit md:min-w-56 absolute z-10 top-3 md:top-auto left-0 right-0 mx-auto md:bottom-[calc(100%+10px)] md:left-full md:right-full md:[transform:translateX(calc(-50%-10px))] p-3 rounded-xl bg-white shadow-[0px_2px_15px_0px_rgba(0,0,0,0.3)] md:before:absolute md:before:content-[''] md:before:w-0 before:h-0 before:top-full before:left-[calc(50%-5px)] md:before:border-[5px] md:before:border-transparent md:before:border-t-white md:before:border-b-0 md:before:drop-shadow-lg">
      <div className="flex justify-between mb-3">
        <Typography variant="body2">
          <span className="font-medium">
            {seat.seatRow}
            {seat.seatColumn}
          </span>{" "}
          - Select an option
        </Typography>
        <button onClick={() => setSelectedSeat(undefined)}>
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {seat.prices.map((price) => (
          <Button
            key={price.id}
            className="text-sm font-normal w-full md:border-[1px] md:px-3"
            onClick={() => handleAddToCart(price.id)}
            loading={loading}
          >
            <span className="w-full flex justify-between text-sm gap-2">
              <span>{price.priceName}</span>
              <span>{formatToNZD(price.price)}</span>
            </span>
          </Button>
        ))}
        <AnimatePresence>
          {error && (
            <Transition key="error" className="text-red-500 text-sm">
              {error}
            </Transition>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Seat({
  seat,
  isSelected,
  setSelectedSeat,
  eventId,
  isInCart,
}: {
  seat: AllocatedSeatWithPricesModel;
  isSelected: boolean;
  setSelectedSeat: (seat: AllocatedSeatWithPricesModel | undefined) => void;
  eventId: number;
  isInCart: boolean;
}) {
  let seatColour = "bg-green-500";
  if (seat.status === AllocatedSeatStatusEnum.PENDING || isInCart) {
    seatColour = "bg-red-500";
  } else if (
    seat.status === AllocatedSeatStatusEnum.SOLD ||
    seat.status === AllocatedSeatStatusEnum.INACTIVE
  ) {
    seatColour = "bg-gray-500";
  }

  return (
    <div className="md:relative">
      <AnimatePresence>
        {isSelected &&
          seat.status === AllocatedSeatStatusEnum.AVAILABLE &&
          !isInCart && (
            <SeatPopup
              seat={seat}
              setSelectedSeat={setSelectedSeat}
              eventId={eventId}
            />
          )}
      </AnimatePresence>
      <button
        disabled={seat.status !== AllocatedSeatStatusEnum.AVAILABLE || isInCart}
        onClick={() => setSelectedSeat(seat)}
        className={`${seatColour} w-3 h-3 md:w-5 md:h-5 rounded-full`}
      />
    </div>
  );
}

export default function AllocatedEventDetails({
  event,
  setSubtitle,
}: {
  event: EventModel;
  setSubtitle: (subtitle: string) => void;
}) {
  const [selectedSeat, setSelectedSeat] = useState<
    AllocatedSeatWithPricesModel | undefined
  >(undefined);

  const { cartItems } = useCart();

  const { seats, loading } = useGetAllocatedSeats({
    ids: event.allocatedSeatIds,
  });

  useEffect(() => {
    if (seats?.length) {
      const prices = seats.flatMap((seat) => seat.prices);
      const lowestPrice = prices.reduce((acc, price) => {
        return price.price < acc.price ? price : acc;
      });
      const highestPrice = prices.reduce((acc, price) => {
        return price.price > acc.price ? price : acc;
      });

      setSubtitle(`$${lowestPrice.price} - $${highestPrice.price}`);
    }
  }, [seats, setSubtitle]);

  const groupedSeats = useMemo(() => {
    const rows: { [key: string]: AllocatedSeatWithPricesModel[] } = {};
    seats.forEach((seat) => {
      if (!rows[seat.seatY.toString()]) {
        rows[seat.seatY.toString()] = [];
      }
      rows[seat.seatY].push(seat);
    });
    return rows;
  }, [seats]);

  const isItemInCart = (seat: AllocatedSeatWithPricesModel) => {
    return cartItems.some(
      (cartItem) =>
        cartItem.eventType === EventTypeEnum.ALLOCATED &&
        cartItem.eventId === event.id &&
        cartItem.seats.find((v) => v.seatId === seat.id)
    );
  };

  return (
    <div className="relative bg-white rounded-lg px-3 py-5 md:px-8 md:py-8 min-h-56">
      <Typography variant="h3" className="mb-6">
        Select seats
      </Typography>
      <AnimatePresence>
        {loading && (
          <Transition
            key="loading"
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
          >
            <Spinner className="text-violet" />
          </Transition>
        )}
        {!loading && seats.length > 0 && (
          <Transition key="content">
            <Typography variant="h4" className="mb-5 text-center">
              STAGE
            </Typography>
            <div className="relative overflow-scroll md:overflow-visible flex flex-col gap-3 items-center justify-center">
              {Object.keys(groupedSeats).map((group) => (
                <div
                  key={group}
                  className="flex gap-3 items-center justify-center"
                >
                  {groupedSeats[group].map((seat) => (
                    <Seat
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeat?.id === seat.id}
                      setSelectedSeat={setSelectedSeat}
                      eventId={event.id}
                      isInCart={isItemInCart(seat)}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 md:gap-3 mt-5">
              <Typography variant="h4">Legend</Typography>
              <div className="flex gap-2 items-center">
                <div className="bg-green-500 w-3 h-3 md:w-5 md:h-5 rounded-full" />
                <Typography variant="body2">Available</Typography>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-red-500 w-3 h-3 md:w-5 md:h-5 rounded-full" />
                <Typography variant="body2">In cart</Typography>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-gray-500 w-3 h-3 md:w-5 md:h-5 rounded-full" />
                <Typography variant="body2">Unavailable</Typography>
              </div>
            </div>
          </Transition>
        )}
      </AnimatePresence>
    </div>
  );
}
