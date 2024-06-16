import { useRouter } from "next/router";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";
import { EventTypeEnum } from "utils/models/EventTypeEnum";
import Typography from "./Typography";
import Transition from "./AnimationTransition";
import Button from "./Button";
import CloseIcon from "../assets/icons/close.svg";

export default function Cart() {
  const { cartItems, cartOpen, setCartOpen } = useCart();
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
            className="fixed right-0 top-0 w-full md:w-auto md:min-w-[500px] h-full bg-white z-50 p-5 md:p-8 shadow-lg"
          >
            <div className="flex justify-between mb-10">
              <Typography variant="h2">Cart</Typography>
              <button onClick={() => setCartOpen(false)}>
                <CloseIcon className="w-8 h-8" />
              </button>
            </div>
            <AnimatePresence mode="wait">
              {cartItems?.length > 0 ? (
                <Transition key="cart-items">
                  <ul>
                    {cartItems.map((item) => (
                      <li key={item.eventId}>
                        <Typography variant="h3">{item.eventName}</Typography>
                        <ul>
                          {item.eventType === EventTypeEnum.GA ? (
                            item.gaAreas.map((gaArea) => (
                              <li key={gaArea.gaAreaId}>
                                <Typography variant="h4">
                                  {gaArea.gaAreaName}
                                </Typography>
                                <ul>
                                  {gaArea.tickets.map((ticket) => (
                                    <li key={ticket.id}>
                                      <Typography variant="body1">
                                        {ticket.priceName} - {ticket.quantity}
                                      </Typography>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))
                          ) : (
                            <li>
                              <Typography variant="body1">
                                Allocated Seating
                              </Typography>
                            </li>
                          )}
                        </ul>
                      </li>
                    ))}
                  </ul>
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
