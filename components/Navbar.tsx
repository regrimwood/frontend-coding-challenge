import { useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import tailwindConfig from "tailwind.config";
import useMediaQuery from "utils/hooks/useMediaQuery";
import HeaderLogo from "../assets/icons/headerLogo.svg";
import UserIcon from "../assets/icons/user.svg";
import CartIcon from "../assets/icons/cart.svg";

export default function Navbar() {
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const { scrollY } = useScroll();

  scrollY.on("change", (value) => {
    setScrollYProgress(value);
  });

  const isMd = useMediaQuery(`(min-width: ${tailwindConfig.theme.screens.md})`);

  const initialPadding = isMd ? 24 : 16;
  const endPadding = isMd ? 16 : 12;

  return (
    <motion.nav
      animate={{
        paddingTop: scrollYProgress > 0 ? endPadding : initialPadding,
        transition: { type: "spring", duration: 1, bounce: 0 },
      }}
      className="fixed w-full pb-3 md:pb-4 px-5 md:px-10 flex items-center justify-between"
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{
          height: scrollYProgress > 0 ? "100%" : "0%",
          transition: { type: "spring", duration: 1, bounce: 0 },
        }}
        className="top-0 left-0 h-full w-full absolute z-0 bg-black bg-opacity-60 backdrop-blur-sm"
      />
      <Link className="z-10" href="/">
        <HeaderLogo className="w-20 h-12 md:w-24 md:h-16" />
      </Link>
      <div className="relative z-10 flex gap-4 items-center">
        <button className="w-8 h-8 md:w-12 md:h-12 flex justify-center items-center">
          <CartIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button className="w-8 h-8 md:w-12 md:h-12 flex justify-center items-center">
          <UserIcon className="text-white w-5 h-5 md:w-7 md:h-7" />
        </button>
      </div>
    </motion.nav>
  );
}
