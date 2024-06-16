import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TicketInputModel, useCart } from "./CartContext";
import { EventTypeEnum } from "utils/models/EventTypeEnum";
import Typography from "./Typography";
import Transition from "./AnimationTransition";
import Button from "./Button";
import CloseIcon from "../assets/icons/close.svg";
import formatToNZD from "utils/formatToNZD";

export default function Cart() {
  const [error, setError] = useState<string | undefined>(undefined);

  const { cartItems, cartOpen, setCartOpen, removeFromCart, getCartSubtotal } =
    useCart();
  const router = useRouter();

  useEffect(() => {
    const onRouteChangeStart = () => {
      setCartOpen(false);
    };
    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [router.events, setCartOpen]);

  const handleRemove = (item: TicketInputModel) => {
    try {
      removeFromCart(item);
    } catch (e: any) {
      setError(e?.message ?? "Unable to remove item from cart");
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute h-full w-full bg-black bg-opacity-60 z-40"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", duration: 0.75, bounce: 0 }}
            className="fixed right-0 top-0 w-full md:w-auto md:min-w-[500px] h-full bg-white z-50 p-5 md:p-8 shadow-lg flex flex-col overflow-auto"
          >
            <div className="flex justify-between mb-10">
              <Typography variant="h2">Cart</Typography>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <CloseIcon className="w-8 h-8" />
              </button>
            </div>
            <AnimatePresence mode="wait">
              {cartItems?.length > 0 ? (
                <Transition key="cart-items" className="flex flex-col h-full">
                  <ul className="flex-1 flex flex-col gap-5">
                    {cartItems.map((item) => (
                      <li key={item.eventId}>
                        <Typography variant="h3" className="mb-3 text-violet">
                          {item.eventName}
                        </Typography>
                        {item.eventType === EventTypeEnum.GA ? (
                          <ul className="flex flex-col gap-3">
                            {item.gaAreas.map((gaArea) => (
                              <li
                                key={gaArea.gaAreaId}
                                className="bg-neonBlue bg-opacity-5 rounded-md pb-4 pt-3 px-4"
                              >
                                <Typography variant="h4" className="mb-3">
                                  {gaArea.gaAreaName}
                                </Typography>
                                <ul className="flex flex-col gap-3">
                                  {gaArea.tickets.map((ticket) => (
                                    <li
                                      key={ticket.id}
                                      className="py-2 px-3 rounded-md border-purple bg-purple bg-opacity-10 border-[1px] md:border-2"
                                    >
                                      <div className="mb-1 flex justify-between items-center">
                                        <Typography
                                          variant="body1"
                                          className="font-medium"
                                        >
                                          {ticket.priceName}
                                        </Typography>
                                        <button
                                          className="underline"
                                          onClick={() =>
                                            handleRemove({
                                              eventId: item.eventId,
                                              gaAreaId: gaArea.gaAreaId,
                                              priceId: ticket.id,
                                              quantity: ticket.quantity,
                                            })
                                          }
                                        >
                                          Remove
                                          <CloseIcon className="w-4 h-4 inline-block ml-1" />
                                        </button>
                                      </div>
                                      <div className="flex justify-between">
                                        <Typography variant="body1">
                                          {ticket.quantity} ticket
                                          {ticket.quantity > 2 ? "s" : ""}
                                        </Typography>
                                        <Typography variant="body1">
                                          {formatToNZD(
                                            ticket.price * ticket.quantity
                                          )}
                                        </Typography>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="bg-neonBlue bg-opacity-5 rounded-md pb-4 pt-3 px-4 flex flex-col gap-4">
                            {item.seats.map((seat) => (
                              <li
                                key={seat.id}
                                className="py-2 px-3 rounded-md border-purple bg-purple bg-opacity-10 border-[1px] md:border-2"
                              >
                                <div className="mb-1 flex justify-between items-center">
                                  <Typography
                                    variant="body1"
                                    className="font-medium"
                                  >
                                    {seat.priceName}
                                  </Typography>
                                  <button
                                    className="underline"
                                    onClick={() =>
                                      handleRemove({
                                        eventId: item.eventId,
                                        seatId: seat.seatId,
                                        priceId: seat.id,
                                        quantity: 1,
                                      })
                                    }
                                  >
                                    Remove
                                    <CloseIcon className="w-4 h-4 inline-block ml-1" />
                                  </button>
                                </div>
                                <div className="flex justify-between">
                                  <Typography variant="body1">
                                    {seat.seatRow}
                                    {seat.seatColumn}
                                  </Typography>
                                  <Typography variant="body1">
                                    {formatToNZD(seat.price)}
                                  </Typography>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5 flex flex-col gap-4 pb-5">
                    <AnimatePresence>
                      {error && (
                        <Transition key="error">
                          <Typography variant="body2" className="text-red-500">
                            {error}
                          </Typography>
                        </Transition>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center justify-between">
                      <Typography variant="body1" className="font-medium">
                        Subtotal:
                      </Typography>
                      <Typography variant="body1">
                        {formatToNZD(getCartSubtotal())}
                      </Typography>
                    </div>
                    <Button reverse className="w-full" href="/">
                      Checkout
                    </Button>
                  </div>
                </Transition>
              ) : (
                <Transition
                  key="no-items"
                  className="h-full pb-20 flex flex-col items-center justify-center"
                >
                  <Typography variant="body1" className="pb-4">
                    There are no items in your cart!
                  </Typography>
                  <Button href="/" reverse className="w-full">
                    Continue shopping
                  </Button>
                </Transition>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
