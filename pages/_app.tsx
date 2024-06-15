import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/components/CartContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </>
  );
}

export default MyApp;
