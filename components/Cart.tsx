import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";
import CloseIcon from "../assets/icons/close.svg";
import Typography from "./Typography";

export default function Cart() {
  const cartContext = useCart();

  return (
    <AnimatePresence>
      {cartContext.cartOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute h-full w-full bg-black bg-opacity-60 z-40"
            onClick={() => cartContext.setCartOpen(false)}
          />
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", duration: 0.75, bounce: 0 }}
            className="absolute right-0 top-0 w-full md:w-1/2 h-full bg-white z-50 p-5 md:p-8 shadow-lg"
          >
            <div className="flex justify-between">
              <Typography variant="h2">Cart</Typography>
              <button onClick={() => cartContext.setCartOpen(false)}>
                <CloseIcon className="w-8 h-8" />
              </button>
            </div>
            <ul></ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
