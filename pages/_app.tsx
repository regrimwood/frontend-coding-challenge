import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "../components/CartContext";
import Cart from "../components/Cart";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <CartProvider>
        <Navbar />
        <Cart />
        <Component {...pageProps} />
      </CartProvider>
    </>
  );
}

export default MyApp;
