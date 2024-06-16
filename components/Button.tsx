import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import tailwindConfig from "tailwind.config";
import alpha from "utils/alpha";
import Spinner from "../assets/icons/spinner.svg";

export default function Button({
  children,
  onClick,
  className,
  selected,
  href,
  reverse,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
  href?: string;
  reverse?: boolean;
  loading?: boolean;
}) {
  const { neonBlue, white } = tailwindConfig.theme.extend.colors;

  const variants = {
    unselected: {
      backgroundColor: reverse ? neonBlue : alpha(neonBlue, 0),
      color: reverse ? white : neonBlue,
    },
    selected: {
      backgroundColor: reverse ? alpha(neonBlue, 0) : neonBlue,
      color: reverse ? neonBlue : white,
    },
  };

  const button = (
    <motion.button
      onClick={onClick}
      className={`relative font-medium text-sm md:text-base py-2 px-4 md:px-6 rounded-md border-neonBlue border-[1px] md:border-2 ${className}`}
      initial="unselected"
      whileHover={loading ? undefined : "selected"}
      animate={selected ? "selected" : "unselected"}
      variants={variants}
      disabled={loading}
    >
      <motion.div
        className="absolute h-full w-full top-0 left-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 1 : 0 }}
      >
        <Spinner className="w-5 h-5" />
      </motion.div>
      <motion.div animate={{ opacity: loading ? 0 : 1 }}>{children}</motion.div>
    </motion.button>
  );

  return href ? (
    <Link href={href} className={className}>
      {button}
    </Link>
  ) : (
    button
  );
}
